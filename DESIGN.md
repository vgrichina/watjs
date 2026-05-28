# watjs — Design

A **fully WAT-native JavaScript interpreter**. The engine itself is written in WATX
(an extended WebAssembly Text dialect) and compiled to a single `.wasm` module. JS
source is lexed, parsed, and executed *entirely inside* WASM. The host (a Node CLI)
provides only a thin I/O surface (`print`, source bytes, clock). Conformance is driven
by the QuickJS assertion tests, then test262.

> Lineage: same hand-written-WAT approach as `wine-assembly` (x86 PE interpreter in
> ~48k lines of WAT). We reuse the **WATX compiler** from `watx.berrry.app` for the
> build layer and discard its canvas runtime.

---

## TL;DR

```
 BUILD TIME (dev machine — reuse WATX compiler, no canvas)
 ┌──────────────┐   include+macro+layout    ┌──────────────┐   binary    ┌───────────┐
 │ src/*.watx   │ ─────────────────────────▶│ WATX compiler│ ───────────▶│ watjs.wasm│
 │ (the engine) │   PARSE INCLUDE EXPAND     │ (JS, no DOM) │   emit      │ 1 module  │
 └──────────────┘   CHECK LOWER EMIT         └──────────────┘             └───────────┘

 RUN TIME (per test — JS executes entirely in WASM)
 ┌─────────┐  bytes  ┌───────────────────────── watjs.wasm ─────────────────────────┐
 │ test.js │────────▶│  lex → parse → (threaded code) → exec → JSValue → ToString   │
 └─────────┘ into    │                                                              │
 ┌─────────┐ linear  │  imports:  print(ptr,len)   host_panic(ptr,len)   now_ms()   │
 │assert.js│ memory  │  exports:  eval(ptr,len)->tag  last_error()  heap_reset()    │
 └─────────┘────────▶└──────────────────────────────────────────────────────────────┘
                                  ▲ thin host. NO canvas / input / DOM.
```

**Decisions locked in:**
- Value representation: **NaN-boxing in i64** (one 64-bit slot per JSValue).
- Execution: **Phase 1 tree-walk → Phase 2 threaded code** (see below). No runtime
  WASM emission (impossible in-sandbox); no separate bytecode-switch stage.
- Build: reuse WATX compiler stages; replace canvas runtime with a Node CLI harness.

---

## 1. Why not "compile JS to WASM at runtime"?

A running `.wasm` module's functions are **fixed at instantiation** — you cannot
synthesize a new WASM function from inside the sandbox. The only way to emit WASM at
runtime is a host round-trip (`new WebAssembly.Module(bytes)` + instantiate + link
shared memory) per compile — heavyweight, breaks "fully WAT-native", and absurd
per `eval()`. **Real JIT-to-wasm is off the table.**

Therefore "compiled" execution means: the compiled program is **data** (an array in
linear memory) interpreted by **pre-compiled WAT handlers**.

```
  JS source ──parse──▶ AST ──┬─────────────────────────────────────────────────────┐
                             │                                                     │
   (A) TREE-WALK             (B) BYTECODE+switch          (C) THREADED CODE         │
   eval AST node-by-node     byte[] + one big WAT loop      funcidx[] in a table,   │
                             with br_table dispatch         call_indirect / or      │
                                                            return_call_indirect    │
                                                            (tail = direct threading)
```

|                | (A) Tree-walk | (B) Bytecode+switch | (C) Threaded code        |
|----------------|---------------|---------------------|--------------------------|
| compiled IR    | none          | compact `byte[]`    | `funcidx[]` table        |
| dispatch       | recursion     | `br_table`, 1 fn    | `call_indirect` / tail   |
| modularity     | medium        | poor (mega-fn)      | excellent (fn/opcode)    |
| perf           | slowest       | fast                | fast; tail = no overhead |
| dependency     | none          | none                | WASM tail-call ext       |
| debug          | easiest       | hard                | medium                   |

**Plan:** Phase 1 = (A) tree-walk for fastest test-suite green. Phase 2 = (C) threaded
code, matching wine-assembly's Forth-style model and reusing its tail-call + compat
dual-build. Skip (B) — (C) gives the same compiled win while staying modular. Same AST
front-end feeds both.

---

## 2. Interpreter stages (inside watjs.wasm)

```
  source bytes in linear memory
        │
        ▼
  ┌───────────┐   tokens (arena)       ┌───────────┐   AST nodes (layout structs)
  │  LEXER    │──────────────────────▶ │  PARSER    │──────────────────────────┐
  │ char→tok  │                        │ Pratt/RD   │                          │
  └───────────┘                        └───────────┘                          ▼
                                                                       ┌──────────────┐
   Phase 1: tree-walk the AST directly  ◀────────────────────────────│  AST in heap │
   Phase 2: AST → threaded code, run via call_indirect ◀──────────────└──────────────┘
        │                                            │
        ▼                                            ▼
  ┌───────────┐   reads/writes              ┌──────────────┐
  │ EVALUATOR │◀───────────────────────────│ ENV / SCOPE  │  lexical chain of records
  └───────────┘                             └──────────────┘
        │ produces
        ▼
   JSValue ──▶ exception? set last_error, return THROW tag
            └▶ normal? return value tag (+ ToString for the harness)
```

---

## 3. Value representation — NaN-boxing in i64

WASM gives native `i64`/`f64`, so every JSValue is one 64-bit slot.

```
  f64 number:   raw IEEE-754 double (any non-NaN bit pattern)
  ─────────────────────────────────────────────────────────────────
  boxed (quiet-NaN prefix 0x7FF8.... + 3-bit tag + 48-bit payload):

   63        51 50   48 47                                   0
  ┌───────────┬───────┬──────────────────────────────────────┐
  │ 0x7FF8    │  tag  │            payload (ptr / int / imm)   │
  └───────────┴───────┴──────────────────────────────────────┘
        tag: 000=undefined 001=null 010=bool 011=int32
             100=string-ptr 101=object-ptr 110=symbol 111=…
```

- Heap pointers are 32-bit linear-memory offsets → fit easily in 48-bit payload.
- `is_number` = "not a boxed-NaN"; type test = mask + compare.
- pack/unpack helpers live in `value.watx`; everything else treats JSValue opaquely.

---

## 4. Heap object model — built from WATX `layout`s

```
 (layout Obj                         (layout Shape          ; hidden-class / map
   (field shape   ptr)                 (field proto    ptr)
   (field props   ptr)   ; i64[]       (field nprops   i32)
   (field klass   u8))                 (field keys     ptr) ; interned-string ids
                                       (field offsets  ptr))
 (layout Str                         (layout Fn
   (field len     i32)                 (field shape    ptr)
   (field hash    i32)                 (field code     ptr) ; AST node, later threaded
   (field bytes   u8))  ; inline       (field env      ptr) ; closure scope
                                       (field nargs    i32))

      Obj ──shape──▶ Shape ──proto──▶ Obj(prototype) ──▶ … ──▶ null
       └──props──▶ [v0 v1 v2 …]   (parallel to Shape.offsets — shape transitions
                                   give inline-cache-ready property lookup)
```

`load.field`/`store.field`/`size-of`/`offset-of` (WATX) handle all offset math — never
hand-write `i32.load offset=N`. This is the biggest leverage WATX gives the engine.

---

## 5. Memory model — regions now, GC later

```
  linear memory
  ┌──────────┬───────────────┬──────────────────────────┬───────────────┐
  │  STATIC  │   STRING POOL │        JS HEAP            │  EVAL ARENA   │
  │ consts,  │  interned ids │ bump-alloc objects/arrays │ per-eval AST, │
  │ globals  │  (immortal)   │ (mark-sweep added later)  │ tokens, scope │
  └──────────┴───────────────┴──────────────────────────┴───────────────┘
                                                          ▲ with-region:
                                                          reset wholesale
                                                          after each eval()
```

- WATX `(with-region …)`/`(region.alloc …)` = the eval arena for free.
- JS heap starts as a pure bump allocator (no GC) — enough to pass the assertion
  suite. Add simple mark-sweep when test262 memory pressure demands it.
- `heap_reset()` export wipes between tests for isolation.

---

## 6. Host API — minimal, test-suite-shaped (replaces canvas)

```
  IMPORTS (host → wasm)                 EXPORTS (wasm → host)
  ─────────────────────                 ─────────────────────
  print(ptr,len)      console.log       eval(src_ptr,len) -> i32 tag
  host_panic(ptr,len) fatal/abort       alloc_input(len)  -> ptr   ; host writes src here
  now_ms()  -> f64    Date.now          last_error_str()  -> ptr   ; for "expected throw"
  read_file(p,l)->ptr modules (later)   result_to_str(tag)-> ptr   ; ToString for diffing
                                         heap_reset()              ; isolate tests
                                         memory (exported)         ; host reads strings
```

No DOM, no graphics. Everything JS-observable (`console.log`, `Date.now`) is a one-line
host shim.

---

## 7. Test harness flow (Node CLI, outside the wasm)

```
  ┌─ runner.js (host) ─────────────────────────────────────────────┐
  │ 1. instantiate watjs.wasm with {print, now_ms, host_panic}      │
  │ 2. concat( harness includes + test.js ) ─┐                      │
  │ 3. ptr = alloc_input(len); memory.set(...)│ write into wasm mem │
  │ 4. tag = eval(ptr, len) ◀─────────────────┘                     │
  │ 5. PASS if no THROW tag (assertion tests) …                     │
  │    … or if THROW matches `negative:` frontmatter (test262)      │
  │ 6. heap_reset()  → next test                                    │
  └─────────────────────────────────────────────────────────────────┘

  LADDER:   own assert.js  ─▶  QuickJS test_language/builtin/closure/loop/bigint
            ─▶  test262 (frontmatter-driven, errors.txt baseline)
```

Two testing layers, in QuickJS's own order:
1. **Assertion tests** — self-checking JS; pass = "no throw". Trivial runner. Vendor
   `assert.js` + engine-generic `test_*.js` (skip `test_std`/`test_bjson`/`test_worker`).
2. **test262** — official tc39 suite (50k+ files). Expected result is encoded in YAML
   frontmatter (`negative:`, `flags:`, `includes:`, `features:`). Maintain an
   `errors.txt` baseline; CI fails only on *new* regressions.

---

## 8. Source layout (WATX `include` graph)

```
  src/
   main.watx          ; exports eval/heap_reset/etc, glues stages
   ├─ include lex.watx        ; char classes, token structs
   ├─ include parse.watx      ; Pratt parser → AST layouts
   ├─ include value.watx      ; NaN-box pack/unpack, type predicates
   ├─ include heap.watx       ; region.alloc wrappers, Obj/Str/Shape/Fn
   ├─ include eval.watx       ; tree-walk evaluator (Phase 1)
   ├─ include builtins/…      ; Object,Array,String,Math,JSON … (one file each)
   └─ include error.watx      ; exceptions, last_error
```

Macros (`defmacro`) for the repetitive parts: AST-node / opcode dispatch, builtin
registration, `ToString`/`ToNumber` coercion tables.

---

## 9. Phasing — tied to the test suite

| Phase | Engine capability                         | Green when                                   |
|-------|-------------------------------------------|----------------------------------------------|
| 0     | lexer + parser + tree-walk arithmetic/vars| own smoke `.js`                              |
| 1     | functions, closures, control flow         | `test_language`, `test_closure`, `test_loop` |
| 2     | objects, arrays, prototypes, key builtins | `test_builtin`                               |
| 3     | BigInt, exceptions, edge coercions        | `test_bigint`                                |
| 4     | threaded code + GC + spec edge cases      | test262 w/ shrinking `errors.txt`            |

---

## 10. What we take from WATX (and what we drop)

**Keep (build layer):** S-expr parser, include resolver, macro expander, layout/offset
engine, bidirectional type checker (zero implicit coercion), binary codegen
(LEB128/sections/opcodes), and the paren-depth diagnostic tracer — invaluable when
hand-editing tens of thousands of lines of S-expressions.

**Drop:** `runtime.js` (canvas/mouse/rAF host). Replaced by the Node CLI harness above.

**Reusable as-is; not:** the compiler is engine-agnostic. The runtime is canvas-specific
and is replaced wholesale.

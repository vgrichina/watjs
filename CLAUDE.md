# watjs

A **fully WAT-native JavaScript interpreter**: the engine is written in WATX (extended
WebAssembly Text) and compiled to a single `.wasm`. JS source is lexed, parsed, and
executed entirely inside WASM. The host provides only a thin I/O surface. See
[DESIGN.md](./DESIGN.md) for the full architecture and diagrams.

## Core decisions (do not relitigate without reason)

- **No runtime WASM emission.** A running module's functions are fixed at instantiation;
  you cannot synthesize WASM in-sandbox. "Compiled" code = *data* (array in linear
  memory) interpreted by pre-compiled WAT handlers. Real JIT-to-wasm is out of scope.
- **Execution model:** Phase 1 = tree-walk the AST. Phase 2 = threaded code
  (`call_indirect` / `return_call_indirect`, Forth-style, like wine-assembly). Skip a
  bytecode+switch stage. Same AST front-end feeds both.
- **Value representation:** NaN-boxing in i64 (quiet-NaN prefix `0x7FF8` + 3-bit tag +
  48-bit payload). pack/unpack confined to `value.watx`.
- **Memory:** bump allocator now (`with-region`/`region.alloc`); add mark-sweep GC when
  test262 demands it. `heap_reset()` isolates tests.
- **Build layer = WATX compiler** (from watx.berrry.app), canvas runtime discarded.

## Toolchain

The WATX compiler is reused (vendored under `tools/`/`lib/`, TBD):

- `compiler-parser.js` — S-expr tokenizer/reader + paren-depth diagnostics
- `compiler-stages.js` — include resolver, macro expander, bidirectional type checker
- `compiler-codegen.js` — IR lowering + WASM binary encoder + disassembler
- `compiler.js` — pipeline: PARSE → INCLUDE → EXPAND → CHECK → LOWER → EMIT

**Drop `runtime.js` (canvas/mouse/rAF).** Replace with a Node CLI harness (`runner.js`)
exposing only `print`, `host_panic`, `now_ms`, source-byte injection.

Key WATX forms used: `(include "f.watx")`, `(defmacro …)`, `(layout T (field …))`,
`load.field`/`store.field`/`load.elem`/`store.elem`/`size-of`/`offset-of`,
`(with-region …)`/`(region.alloc …)`, `(let $x type …)`/`(set! …)`, `(effects …)`.
The compiler enforces **zero implicit coercion** — write all type conversions explicitly.

## Source layout (planned)

```
src/main.watx              ; exports eval/heap_reset; glues stages
  include lex.watx         ; char classes, token structs
  include parse.watx       ; Pratt parser → AST layouts
  include value.watx       ; NaN-box pack/unpack, type predicates
  include heap.watx        ; region.alloc wrappers; Obj/Str/Shape/Fn layouts
  include eval.watx        ; tree-walk evaluator (Phase 1)
  include builtins/*.watx  ; Object, Array, String, Math, JSON … (one file each)
  include error.watx       ; exceptions, last_error
```

## Engine ABI

Imports (host → wasm): `print(ptr,len)`, `host_panic(ptr,len)`, `now_ms()->f64`,
`read_file(p,l)->ptr` (later).
Exports (wasm → host): `eval(src_ptr,len)->i32 tag`, `alloc_input(len)->ptr`,
`last_error_str()->ptr`, `result_to_str(tag)->ptr`, `heap_reset()`, exported `memory`.

## Testing (two layers, in QuickJS's order)

1. **Assertion tests** — self-checking JS; pass = "no throw". Vendor `assert.js` +
   engine-generic `test_*.js` from quickjs-ng (skip `test_std`/`test_bjson`/`test_worker`
   until late). Write our own assertion `.js` files as features land.
2. **test262** — tc39 official suite; expected result is in YAML frontmatter
   (`negative:`/`flags:`/`includes:`/`features:`). Maintain an `errors.txt` baseline;
   fail CI only on *new* regressions. Use QuickJS's `test262.conf` as a feature map.

**Always** write test output to a file (e.g. `test-out/<date>.txt`) so runs can be
grepped and diffed.

## Phasing

0: lex+parse+arith → 1: functions/closures/control-flow (`test_language/closure/loop`)
→ 2: objects/arrays/prototypes/builtins (`test_builtin`) → 3: BigInt/exceptions
(`test_bigint`) → 4: threaded code + GC + test262.

## Conventions

- Match surrounding WAT/WATX idiom; one logical unit per `include` file.
- Hand-written WAT at scale: lean on the paren-depth diagnostic when forms don't balance.
- Don't reach for canvas/DOM host functions — the harness is headless and test-driven.

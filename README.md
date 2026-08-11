# watjs

A **JavaScript interpreter written in WAT** (WebAssembly Text), compiled to a single
`.wasm` module by a vendored+extended WATX compiler. JS source is lexed, parsed, and
executed entirely inside WebAssembly; the host (Node) provides only a thin I/O surface.

See [DESIGN.md](./DESIGN.md) for architecture and [CLAUDE.md](./CLAUDE.md) for
working notes.

## Quick start

```sh
node tools/build.js            # compile src/*.watx -> watjs.wasm
node tools/test.js             # run the whole suite (unit probes + js tests)
node tools/run-tests.js test/assertions.js   # run one test
```

## Layout

```
src/        the engine, in WATX (compiled to watjs.wasm)
  value.watx     NaN-boxed JSValue (i64): number = f64; boxed tag+payload otherwise
  heap.watx      VM registers, bump allocator, Str objects
  lex.watx       tokenizer / lexer
  scope.watx     lexical environments (variable bindings, TDZ)
  tostring.watx  ToString / ToNumber / ToPrimitive
  obj.watx       objects (property map) + arrays + get/set_prop, descriptors
  eval.watx      shared parse helpers / AST front-end
  vm.watx        the bytecode VM — compiles the AST to threaded code and runs it
  regex.watx     backtracking regular-expression engine
  json.watx      JSON.stringify / JSON.parse
  main.watx      imports + exports (eval/alloc_input/heap_reset/generator glue)
tools/      WATX compiler (vendored from watx.berrry.app, canvas runtime removed)
            + Node build/test harness (build.js, run-tests.js, test262.js)
test/       *.watx unit probes (t_* return 1) and *.js end-to-end tests
test262/    curated slices of the tc39 test262 suite + its harness
```

## Execution model

Source is **lexed → parsed to an AST → compiled to threaded bytecode → executed**,
all inside the wasm module. The bytecode is *data* (an array of function indices in
linear memory) dispatched through `call_indirect` — no runtime WASM emission, which
is impossible in-sandbox (see [DESIGN.md §1](./DESIGN.md)). An earlier tree-walk
re-scan interpreter was retired in favour of this single VM; the savable VM stack is
what makes **generators and `async`/`await`** (suspend/resume mid-execution) possible.

Values use **NaN-boxing in i64**: any non-NaN f64 bit pattern is a number; a
quiet-NaN prefix + 3-bit tag + 48-bit payload encodes everything else
(undefined/null/bool/int32/string/object/symbol). pack/unpack lives in `value.watx`;
the rest of the engine treats a JSValue as opaque.

## Implemented

A large, spec-tracking subset of ECMAScript — enough that the tc39 test262 harness
runs and passes the majority of the core-language and built-ins suites.

- **Language:** full operator set (arithmetic/relational/equality/logical/bitwise,
  `** ?? ?.`, compound + `++`/`--` on identifier & member targets), all literal
  forms, template literals, spread/rest, destructuring (array/object, nested,
  defaults, patterns in params / `for`-heads / `catch`), optional chaining
- **Control flow:** `if`/`while`/`do`/`for`/`for-in`/`for-of`/`for-await-of`/
  `switch`, labelled statements, `break`/`continue`, `try`/`catch`/`finally`,
  `throw`, `with`
- **Scoping:** real nested lexical environments — block scope, per-iteration
  `for`-`let` bindings, TDZ, `var` hoisting, a global lexical environment
  (`let`/`const`/`class` off `globalThis`), and direct-vs-indirect `eval` scoping
- **Functions:** closures, arrow functions, default/rest params, mapped/unmapped
  `arguments`, `.name`/`.length`, generators (`function*`, `yield`/`yield*`),
  `async`/`await`, async generators, `new.target`, `Function.prototype` methods
- **Objects & classes:** prototype chains, getters/setters, property descriptors,
  classes (fields, private `#members`, static blocks, `extends`/`super`,
  **subclassing native built-ins**)
- **Built-ins:** `Object`, `Array`, `String`, `Number`, `Boolean`, `Math`, `JSON`,
  `Map`/`Set`/`WeakMap`/`WeakSet`, `Symbol`, `BigInt`, `Date`, `RegExp` (named
  groups, inline modifiers, `u`-mode, legacy statics), `Promise` (microtask job
  queue), `Proxy`/`Reflect`, **TypedArrays / `ArrayBuffer`** (incl. resizable /
  length-tracking buffers, base64/hex), iterators & iterator helpers
- Strict mode, spec-precise `ToPrimitive`/coercion, and a broad sweep of syntactic
  early-errors (`SyntaxError` before execution)

## Testing

Three layers:

1. **Unit probes** (`test/*.watx`): exported `t_*` functions return 1; exercise the
   value/heap/lexer layers directly. (`tools/run-units.js`)
2. **End-to-end** (`test/*.js`): real JS; pass = no uncaught throw and (if a sibling
   `*.expected` exists) stdout matches. `test/assertions.js` is the QuickJS-style
   format. (`tools/run-tests.js`; both via `tools/test.js`)
3. **test262** (`tools/test262.js`): runs real tc39/test262 cases. The official
   harness (`sta.js` + `assert.js`) loads and runs; `assert.sameValue` /
   `assert.throws` work. Frontmatter (`flags`/`includes`/`negative`) is honored.

The runners instantiate `watjs.wasm` with `{print, host_throw, host_panic, now_ms}`,
write source via `alloc_input`, call `eval`, and check the result.

## test262 status

The full tc39 harness (`sta.js` + `assert.js`) loads and runs. On the curated
slices in `test262/` the engine passes **161 / 165** files (batch 39/39, broad
35/36, broad2 30/30, broad3 24/24, cases 4/4, harness 29/32).

Against the **entire** vendored tc39 tree (~53k files, fresh wasm instance per test,
1 s timeout) the last full sweep passed **~34k / 47k** run files (≈72%, excluding
skips) with **0 crashes / 0 hangs**. `language` sits around 92%; `intl402` is near
zero because `Intl` is unimplemented. Live metrics and history:
[status.html](./status.html).

Passing the entire suite to spec precision is a long-tail effort; the remaining
failures are correctness/architectural, not stability. See the dashboard for the
per-area breakdown.

## Known limitations

- **`Intl`** unimplemented (`intl402` ≈ 1%), and **`Temporal`** not implemented.
- **ES modules**: only a `import()` parsing + Promise-returning stub; no real module
  linking. No `Atomics`/`SharedArrayBuffer`, no cross-realm.
- **Strings are UTF-8 internally**, so lone surrogates aren't single UTF-16 code
  units — blocks `isWellFormed`/`toWellFormed` and some astral-plane edge cases.
- **Memory** is a bump allocator with `heap_reset()` between tests; a mark-sweep GC
  is deferred until a long-running workload needs it.
- Some deep object-model corners remain (e.g. an array/function serving as a
  `[[Prototype]]`; member-prefix `++`/`--` evaluation order).

See [DESIGN.md](./DESIGN.md) for the architecture and the phasing plan.

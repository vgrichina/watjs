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
  lex.watx       tokenizer + lexer-cursor save/restore
  scope.watx     lexical environments (variable bindings)
  tostring.watx  ToString / ToNumber
  obj.watx       objects (property map) + arrays + get/set_prop
  eval.watx      precedence-climbing parse-and-evaluate + statements
  main.watx      imports, eval()/alloc_input() exports
tools/      WATX compiler (vendored from watx.berrry.app, canvas runtime removed)
            + Node build/test harness
test/       *.watx unit probes (t_* return 1) and *.js end-to-end tests
```

## Execution model

Parse-and-evaluate over the token stream (no separate AST). Because the lexer is a
cursor into source, control flow that re-executes code (loops, function bodies) works
by **saving and restoring the lexer cursor** and re-scanning. A `SUPPRESS` counter
gates observable side effects (print, variable mutation, returns) so untaken branches
and skip-scans parse without executing. Functions capture their body's cursor + params
+ defining scope (closures); `return`/`throw` unwind via register flags.

Values use **NaN-boxing in i64**: any non-NaN f64 bit pattern is a number; the
negative-quiet-NaN prefix `0xFFF8…` marks a boxed value with a 3-bit tag
(undefined/null/bool/string/object/function/array) and 48-bit payload.

## Implemented

- Numbers (f64), strings, booleans, null, undefined, NaN, Infinity
- Operators: `+ - * / %`, comparisons, `=== !== == !=`, `&& || !`, ternary,
  unary `- + ! ~ typeof void`, `++ -- += -= *= /=`, bitwise `& | ^ << >> >>>`,
  `instanceof`
- Number literals: decimal, exponent, `0x`/`0b`/`0o`
- `var` (with hoisting)/`let`/`const`, assignment, lexical scope, blocks
- `if`/`else`, `while`, `do`/`while`, `for`, `switch` (fall-through), `break`,
  `continue`
- functions, parameters, `return`, recursion, closures, function expressions,
  `.name`/`.length`
- `this`, method calls, `new`, prototypes (chain lookup), `.prototype`,
  `.constructor`, `instanceof`
- `throw`, `try`/`catch`; typed errors (engine throws `ReferenceError`/`TypeError`)
- objects (literals, `.`/`[]` get/set, nested, prototype chain), arrays (literals,
  indexing, `.length`, push idiom), string `.length` and char indexing
- builtins: `print`, `assert`, `eval`, `Number` (+`NaN`/`Infinity` constants),
  `String`, `Boolean`, `isNaN`, `isFinite`; error constructors (`Error`,
  `TypeError`, `RangeError`, `ReferenceError`, `SyntaxError`, `EvalError`,
  `URIError`) via a JS prelude

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

The full tc39 harness loads and a growing fraction of real test262 cases pass
(~13/21 in the sampled batch). Passing the **entire** suite is a person-years
effort (it requires essentially all of ECMAScript to spec precision); this is a
working subset on a steady trajectory.

## Known limitations / next increments

Boxed primitive wrappers (`new Number/String/Boolean` as objects), getters/setters,
`Object`/`Array.prototype` methods (`keys`, `push`, `map`, `forEach`, `join`, …),
labelled statements, `**`, `delete`/`in`, regex, BigInt, generators, `async`/`await`,
classes, modules, `Proxy`/`Reflect`, TypedArrays, Unicode (escapes, non-ASCII
whitespace, identifiers), strict mode, spec-exact (shortest round-trip)
number-to-string, multi-declarator var hoisting, array growth beyond literal
capacity (64). Each is an incremental step toward broader test262 coverage.

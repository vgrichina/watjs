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
  `.constructor`, `instanceof`, `in`, `delete`
- getters/setters: object-literal `{ get x(){}, set x(v){} }` and
  `Object.defineProperty(obj, key, {get,set}|{value})`
- `throw`, `try`/`catch`; typed errors (engine throws `ReferenceError`/`TypeError`)
- objects (literals, `.`/`[]` get/set, nested, prototype chain), arrays (literals,
  indexing, `.length`, push idiom), string `.length` and char indexing
- builtins: `print`, `assert`, `eval`, `parseInt`/`parseFloat`, `isNaN`/`isFinite`;
  `Number` (+`NaN`/`Infinity`/`MAX_SAFE_INTEGER`, `isNaN`/`isInteger`/`isFinite`),
  `String`/`fromCharCode`, `Boolean`, `Array`/`isArray`,
  `Object` (`keys`/`assign`/`create`/`getPrototypeOf`/`defineProperty`),
  `Math` (abs/floor/ceil/round/sqrt/max/min/pow/trunc/sign + PI/E); error
  constructors via a JS prelude
- `String.prototype`: charAt/charCodeAt/indexOf/slice/substring/toUpperCase/
  toLowerCase/split/trim/repeat/toString/valueOf/constructor
- `Array.prototype` (growable): push/pop/indexOf/join/slice/forEach/map/filter/
  reduce/concat/reverse/includes
- ToPrimitive (`valueOf`/`toString`); comma operator

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

The full tc39 harness (`sta.js` + `assert.js`) loads and runs, and real test262
cases pass at a solid rate:

- **39/39** on a targeted batch (expressions/typeof/logical/conditional/types).
- **~88% (58/66)** across *fresh, untargeted* samples spanning for/while/do/switch/
  block/comma/postfix/multiplication/modulus/number/logical-and/undefined — i.e.
  cases not used while developing.

Passing the **entire** suite (50,000+ files) is a person-years effort — it requires
essentially all of ECMAScript to spec precision (regex, generators, async, classes,
Proxy, TypedArrays, BigInt, modules, full Unicode, …). This is a real, growing
core-language subset on a steady trajectory, not the finished suite. The remaining
failures in the samples are niche: shortest-round-trip number formatting,
function-expression-as-loop-condition edge cases, boxed-primitive `valueOf` corners.

## Known limitations / next increments

Boxed primitive wrappers (`new Number/String/Boolean` as objects), getters/setters,
`Object`/`Array.prototype` methods (`keys`, `push`, `map`, `forEach`, `join`, …),
labelled statements, `**`, `delete`/`in`, regex, BigInt, generators, `async`/`await`,
classes, modules, `Proxy`/`Reflect`, TypedArrays, Unicode (escapes, non-ASCII
whitespace, identifiers), strict mode, spec-exact (shortest round-trip)
number-to-string, multi-declarator var hoisting, array growth beyond literal
capacity (64). Each is an incremental step toward broader test262 coverage.

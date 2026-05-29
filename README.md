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
- `if`/`else`, `while`, `do`/`while`, `for`, `for`-`in`, `for`-`of`, `switch`
  (fall-through), `break`, `continue`, labelled statements (`label:`,
  `break label`, `continue label`)
- functions, parameters, `return`, recursion, closures, function expressions,
  `.name`/`.length`, `arguments` object
- arrow functions (`x=>e`, `(a,b)=>e`, `()=>{...}`), template literals
  `` `...${e}...` ``, spread (`[...a]`, `f(...args)`)
- `this`, method calls, `new`, prototypes (chain lookup), `.prototype`,
  `.constructor`, `instanceof`, `in`, `delete`
- getters/setters: object-literal `{ get x(){}, set x(v){} }` and
  `Object.defineProperty(obj, key, {get,set}|{value})`
- classes: declarations/expressions, methods, `static`, `get`/`set`, `extends`,
  `super()`/`super.m()` (single-level inheritance)
- regex (backtracking): `RegExp`/`.test()`, `String` `match`/`replace`/`search` —
  literals, `.`, classes `[..]`/`[^..]`, `\d\w\s`+negations, anchors, `* + ? {n,m}`
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
  toLowerCase/split/trim/trimStart/trimEnd/repeat/includes/startsWith/endsWith/
  padStart/padEnd/at/replaceAll/toString/valueOf/constructor
- `Array.prototype` (growable): push/pop/indexOf/lastIndexOf/join/slice/forEach/
  map/filter/reduce/concat/reverse/includes/find/findIndex/findLast/
  findLastIndex/some/every/sort/at/fill/flat/flatMap
- `Object.prototype.hasOwnProperty`; `Object.values`/`Object.entries`/
  `getOwnPropertyNames`/`fromEntries`; `Array.of`/`Array.from` (arrays, strings,
  iterators, array-likes, optional map)
- optional chaining (`a?.b`, `a?.[i]`, `a?.()`, short-circuiting) and nullish
  coalescing (`a ?? b`)
- `Map` and `Set` (set/get/has/delete/add/forEach/clear/size, chaining)
- `Number.isSafeInteger` + `MIN/MAX_SAFE_INTEGER`/`EPSILON`/`MAX_VALUE`/
  `POSITIVE/NEGATIVE_INFINITY`; `Math.hypot`
- default (`b = expr`) and rest (`...args`) parameters; object spread (`{ ...o }`)
- destructuring (`let [a,b] = …`, `let {x,y} = …`)
- iterator protocol: `for-of` over iterables (objects with `next()` /
  `Symbol.iterator`), `Array.prototype.entries`/`keys`/`values`, array elision
- `++`/`--` (prefix & postfix) and `+= -= *= /=` on identifiers *and*
  member/index targets (`obj.x++`, `arr[i] += n`)
- function-scoped `var` (hoisted out of blocks/loops) vs block-scoped `let`/`const`
- `this` is the global object at top level and in plain (sloppy) calls;
  error construction (`new TypeError("m").toString() === "TypeError: m"`)
- functions carry their source buffer, so prelude- and `eval`-defined functions
  are callable from any context
- `JSON.stringify`/`JSON.parse`; `**` exponentiation (NaN/Inf-correct)
- number→string incl. exponential notation for very large/small magnitudes
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
cases pass at a solid rate on the curated sample sets in `test262/`:

- `batch`: **39/39**, `cases`: **4/4**
- `broad`: **35/36**, `broad2`: **29/30**, `broad3`: **23/24**
- combined ≈ **98%** of these ~133 curated core-language + ES5/ES6 samples.

The 3 remaining failures are genuine architectural/precision walls: tail-call
optimization (would overflow the WAT call stack — needs a bytecode VM),
shortest-round-trip / denormal number formatting, and mapped-`arguments`
aliasing (a deprecated sloppy-mode behavior).

Passing the **entire** suite (50,000+ files) is a person-years effort — it requires
essentially all of ECMAScript to spec precision (regex, generators, async, classes,
Proxy, TypedArrays, BigInt, modules, full Unicode, …). This is a real, growing
core-language subset on a steady trajectory, not the finished suite.

## Known limitations / next increments

Implemented this round: the iterator protocol — `for-of` over any object with a
`next()` method (or an `@@iterator`/`Symbol.iterator` method returning one),
`Array.prototype.entries/keys/values`, `Symbol.iterator` (as a sentinel key),
and array elision (holes).

Not implemented: **generators**/**async** (need continuation capture — a
bytecode-VM rewrite), tail-call optimization, regex groups/alternation/
backrefs/flags, BigInt, modules, `Proxy`/`Reflect`,
TypedArrays, full Unicode (identifiers, property escapes), strict-mode
semantics, spec-exact (shortest round-trip) number-to-string and denormals,
regex literals (`/.../`), named-function-expression name binding,
mapped-`arguments` aliasing, transcendental `Math` (sin/cos/log/exp).

**Generators and `async`/`await`** need continuation capture (suspend/resume a
call mid-execution). The re-scan/parse-and-evaluate interpreter cannot suspend a
WAT call stack, so these require re-architecting around an explicit bytecode VM
with a savable stack — a different engine, not an incremental feature.

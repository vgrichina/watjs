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
  unary `- + !`, `++ -- += -= *= /=`
- `var`/`let`/`const`, assignment, lexical scope, blocks
- `if`/`else`, `while`, `for`
- functions, parameters, `return`, recursion, closures, function expressions
- `throw`, `try`/`catch`
- objects (literals, `.`/`[]` get/set, nested), arrays (literals, indexing,
  `.length`, push idiom), string `.length` and char indexing
- builtins: `print` (console.log style), `assert(cond[, msg])`

## Testing

Two layers, mirroring QuickJS's own approach:

1. **Unit probes** (`test/*.watx`): exported `t_*` functions return 1; exercise the
   value/heap/lexer layers directly.
2. **End-to-end** (`test/*.js`): run real JS. A test passes when `eval` reports no
   uncaught throw and (if a sibling `*.expected` exists) stdout matches it.
   `test/assertions.js` is the QuickJS-style format — self-checking via `assert()`,
   pass = no throw.

The runner (`tools/run-tests.js`) instantiates `watjs.wasm` with
`{print, host_throw, host_panic, now_ms}`, writes source via `alloc_input`, calls
`eval`, and checks the result.

## Known limitations

Not yet implemented: prototypes/`this`/methods, `new`, array methods
(`push`/`map`/…), `switch`, `do/while`, `break`/`continue`, labelled statements,
`**`, bitwise operators, regex, BigInt, modules, `typeof`/`instanceof`, spec-exact
number-to-string (fractions are approximate; integers exact), function-declaration
hoisting, array growth beyond literal capacity (64). These are the natural next
increments toward broader test262 coverage.

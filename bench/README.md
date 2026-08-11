# Benchmarks

JavaScript benchmarks for measuring watjs against other engines. Run them with:

```sh
node tools/bench.js                    # every bench, every available engine
node tools/bench.js queens nbody       # only these
node tools/bench.js awfy               # only the Are We Fast Yet suite
node tools/bench.js --json out.json    # also emit machine-readable results
```

The runner executes each program under up to four engines:

| engine | what it is | enable |
|--------|------------|--------|
| **watjs** | this project — interpreter in WAT, no JIT | always |
| **node** | V8, JIT-compiled | always |
| **qjs** | QuickJS, native interpreter in C | `brew install quickjs` |
| **qjs-wasm** | QuickJS compiled to WebAssembly | `npm install` (optional dep) |

Timing is **internal** (`Date.now`, auto-calibrated to ~300 ms), so engine start-up
is excluded and every engine runs the same problem size. Each program's output/result
is cross-checked across engines (`verify: match`), so a faster run can't be a wrong run.

**The fair comparison is `watjs` vs `qjs-wasm`** — both are interpreters running
*inside* WebAssembly, so the ratio (the `watjs/qjsw` column) isolates the
interpreter-quality gap without V8's JIT or native-code advantage muddying it.
Measured so far: watjs is roughly **20–60× slower than QuickJS-in-wasm** (vs
thousands× against Node's JIT). QuickJS-wasm itself runs within ~1–2× of native
`qjs`, so wasm sandboxing is a minor factor.

## Parse throughput (a separate axis)

`node tools/bench.js` measures **steady-state execution** and excludes parsing (the
source is parsed once, before the timed loop). To measure the *other* half — how fast
the engine turns source into a callable — run the dedicated front-end benchmark:

```sh
node tools/bench-parse.js            # ~200 KB corpus (default)
node tools/bench-parse.js 400        # larger corpus
npm run bench:parse
```

It times `new Function(SRC)` on a large **straight-line** body that is constructed but
**never called**, so the number is lex + parse + front-end compile with *zero*
execution in it. (Straight-line matters: V8/QuickJS lazily skip *nested* function
bodies at construction, which would understate their work — a flat statement body
forces every engine to process all of it.)

Two engine-specific details make the comparison honest:

- **watjs has no garbage collector** (bump allocator), so it can't re-parse in a tight
  loop — memory only grows. The runner does **one parse per fresh wasm instance** and
  takes the min over several instances. A single ~200 KB parse fits comfortably.
- **V8 caches compilation keyed by source text**, so re-parsing the *same* string would
  measure a cache hit, not parsing. The runner feeds the loop **distinct source
  variants** (a unique leading declaration each) to defeat that.

**Result:** watjs parses at roughly **½ the rate of QuickJS-in-wasm** and within ~2× of
*native* QuickJS — i.e. its front-end is competitive; the ~20–60× gap in `tools/bench.js`
is the **interpreter/execution** side, not parsing. As with the compute suite, the
*absolute* MB/s is machine- and load-dependent (both engines scale together), so the
**ratio to the qjs-wasm peer is the stable, meaningful number**.

## Suites

### CLBG — Computer Language Benchmarks Game (`bench/*.js`)

Verbatim CLBG programs (original headers/attribution intact); we don't touch the
algorithms. Each is wrapped in a function that receives a fake `process`/`console`
so its `process.argv[2]` (size) and output are captured.

| file | benchmark | variant |
|------|-----------|---------|
| `nbody.js` | n-body gravitational simulation | node #8 |
| `spectralnorm.js` | spectral norm of an infinite matrix | node #1 |
| `fasta.js` | generate DNA-ish sequences (LCG PRNG) | node #1 |

Only **single-threaded** CLBG programs are included. The current node versions of
fannkuch-redux, binary-trees and mandelbrot use `worker_threads` /
`SharedArrayBuffer`; k-nucleotide uses `cluster`; regex-redux uses workers;
reverse-complement streams `process.stdin` — none of which apply to
single-threaded, event-loop-less watjs, so they're omitted.

### AWFY — Are We Fast Yet (`bench/awfy/*.js`, MIT)

The [Are We Fast Yet](https://github.com/smarr/are-we-fast-yet) suite is
purpose-built for cross-language / cross-engine comparison: single-threaded, no
I/O, deterministic, and **self-verifying**. Verbatim files (`benchmark.js`,
`som.js`, and each benchmark) are bundled in-script with a tiny CommonJS `require`
loader so the identical code runs on every engine.

Included: `bounce`, `deltablue`, `json`, `list`, `permute`, `queens`, `richards`,
`sieve`, `storage`, `towers`. (`mandelbrot`/`nbody` are omitted — their only
watjs-friendly verifiable size is trivial; `cd`/`havlak` are heavy.)

## What the numbers mean

watjs is a **handler-threaded interpreter written in WebAssembly Text, with no
JIT**; it optimizes for correctness and small size. Expect it to trail QuickJS
(bytecode interpreter in optimized C) by ~1–2 orders of magnitude and a JIT
(V8/Node) by more — especially on polymorphic-dispatch-heavy code (`richards`).
The value is **relative**: catching regressions and measuring optimizations.

### Known limit surfaced here

watjs regular expressions are correct, but **regex over large strings traps
(memory OOB) beyond ~50 KB of input** — so the big regex-dna / regex-redux
benchmarks (hundreds of KB) can't run on watjs yet. Small/medium regex is fine.

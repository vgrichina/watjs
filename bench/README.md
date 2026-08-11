# Benchmarks

Macro benchmarks from the [Computer Language Benchmarks Game](https://salsa.debian.org/benchmarksgame-team/benchmarksgame/)
(CLBG), used to measure watjs against other JavaScript engines.

The `.js` files here are **verbatim** CLBG programs — each keeps its original
header and attribution. We don't modify the algorithms.

| file | benchmark | CLBG variant |
|------|-----------|--------------|
| `nbody.js` | n-body gravitational simulation | `nbody node #8` |
| `spectralnorm.js` | spectral norm of an infinite matrix | `spectralnorm node #1` |
| `fasta.js` | generate DNA-ish sequences (LCG PRNG) | `fasta node #1` |

Only **single-threaded** CLBG node programs are included — the current fannkuch /
binary-trees / mandelbrot node entries use `worker_threads` / `SharedArrayBuffer`,
which don't apply to single-threaded watjs.

## Running

```sh
node tools/bench.js                    # all benches, all available engines
node tools/bench.js nbody              # a single bench
node tools/bench.js --json out.json    # also emit machine-readable results
```

The runner executes each program under **watjs**, **Node**, and **QuickJS**
(`qjs`, if installed — `brew install quickjs` / `apt install quickjs`).

### How it stays fair

- Each verbatim program is wrapped in a function that receives a fake
  `process`/`console`, so its `process.argv[2]` (the size `N`) and its output are
  captured without touching the algorithm.
- Timing is **internal** (`Date.now`) with auto-calibration: a fast engine runs the
  program many times until the span exceeds ~300 ms, then reports **ms per
  iteration**. This excludes engine start-up cost.
- Every engine runs the **same `N`** (see `SIZES` in `tools/bench.js`), tuned so
  watjs — which has no JIT — finishes an iteration in roughly 0.3–1.5 s.
- Each program's full output is hashed and the hashes are compared across engines
  (`output: match`), so a faster run can't be a wrong run.

## Interpreting the numbers

watjs is a **tree-of-handlers interpreter written in WebAssembly Text with no JIT**;
it optimizes for correctness and small size, not speed. Expect it to trail QuickJS
(a bytecode interpreter in optimized C) by ~1–2 orders of magnitude, and a JIT like
V8/Node by more on tight numeric loops. The point of tracking these is **relative**:
catching regressions and measuring the effect of engine optimizations over time.

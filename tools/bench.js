#!/usr/bin/env node
// bench.js — run the Benchmarks-Game macro programs in bench/ under watjs and,
// for comparison, Node and QuickJS (if installed). Prints a ratio table.
//
// The programs in bench/ are VERBATIM from the Computer Language Benchmarks Game
// (see each file's header). We don't edit the algorithms: each program is wrapped
// in a function that receives a fake `process`/`console`, so its `process.argv[2]`
// (the size N) and its output are captured by the harness. Timing is INTERNAL
// (Date.now, with auto-calibration) so engine start-up cost is excluded and the
// comparison is fair.
//
// Usage:
//   node tools/bench.js                 # all benches, all available engines
//   node tools/bench.js nbody           # one bench
//   node tools/bench.js --json out.json # also write machine-readable results

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const BENCH_DIR = path.join(ROOT, 'bench');
const WASM = path.join(ROOT, 'watjs.wasm');

// size N per program — chosen so watjs runs ~0.3–1.5s/iteration (it has no JIT).
// Same N is used for every engine, so the comparison is apples-to-apples.
const SIZES = { nbody: 3000, spectralnorm: 40, fasta: 2000 };

// ---- the shared, engine-agnostic harness (prepended to every program) --------
// `print` must exist (watjs & qjs: native; node: we shim it per-engine below).
const HARNESS = `
var __SUP = false, __H = 0;
function __hash(s){ for (var i = 0; i < s.length; i++) __H = (((__H<<5)-__H) + s.charCodeAt(i)) | 0; }
function __emit(s){ if (!__SUP) __hash("" + s); }
var __console = {
  log: function(){ var a=[]; for (var i=0;i<arguments.length;i++) a.push(""+arguments[i]); __emit(a.join(" ")); },
  error: function(){}, warn: function(){}, info: function(){}, debug: function(){}
};
function __mkproc(n){ return { argv: [null, null, ""+n], stdout: { write: function(s){ __emit(s); return true; } }, exit: function(){} }; }
function __capPrint(s){ __emit(s); }
function bench(name, fn){
  __SUP = false; __H = 0; fn();                 // correctness pass — hash the output
  print("__CKSUM " + name + " " + (__H|0));
  __SUP = true;                                 // timed passes — output suppressed
  var reps = 1, ms = 0, t0;
  for (;;) {
    t0 = Date.now();
    for (var r = 0; r < reps; r++) fn();
    ms = Date.now() - t0;
    if (ms >= 300 || reps >= (1<<22)) break;
    reps *= 2;
  }
  print("__BENCH " + name + " " + (ms / reps) + " " + reps);
}
`;

// assemble the full script for one program (verbatim program wrapped, then run)
function buildScript(name, src, forNode) {
  const N = SIZES[name] != null ? SIZES[name] : 1000;
  const printShim = forNode ? 'var print = function(s){ process.stdout.write(String(s) + "\\n"); };\n' : '';
  return printShim + HARNESS +
    '\nfunction __PROG(process, console, print){\n' + src + '\n}\n' +
    'bench(' + JSON.stringify(name) + ', function(){ __PROG(__mkproc(' + N + '), __console, __capPrint); });\n';
}

function parseOutput(out) {
  const res = { ms: null, reps: null, cksum: null };
  for (const line of out.split('\n')) {
    let m;
    if ((m = line.match(/^__BENCH \S+ (\S+) (\d+)/))) { res.ms = parseFloat(m[1]); res.reps = parseInt(m[2], 10); }
    else if ((m = line.match(/^__CKSUM \S+ (-?\d+)/))) { res.cksum = m[1]; }
  }
  return res;
}

// ---- engine drivers ----------------------------------------------------------
async function runWatjs(name, src) {
  const bytes = fs.readFileSync(WASM);
  const mod = await WebAssembly.compile(bytes);
  const dec = new TextDecoder();
  let out = '', mem;
  const inst = await WebAssembly.instantiate(mod, { env: {
    print: (p, l) => { out += dec.decode(new Uint8Array(mem.buffer, p, l)) + '\n'; },
    host_throw: (p, l) => { out += '__THROW ' + dec.decode(new Uint8Array(mem.buffer, p, l)) + '\n'; },
    host_panic: (p, l) => { out += '__PANIC ' + dec.decode(new Uint8Array(mem.buffer, p, l)) + '\n'; },
    now_ms: () => Date.now(),
  }});
  const ex = inst.exports; mem = ex.memory;
  const script = buildScript(name, src, false);
  const enc = new TextEncoder().encode(script);
  const ptr = ex.alloc_input(enc.length);
  new Uint8Array(mem.buffer, ptr, enc.length).set(enc);
  const rc = ex.eval(ptr, enc.length);
  if (rc !== 0 || /__THROW|__PANIC/.test(out)) return { error: (out.match(/__(THROW|PANIC) .*/) || ['non-zero eval'])[0] };
  return parseOutput(out);
}

function runSub(cmd, args, script) {
  try {
    const out = cp.execFileSync(cmd, args, { input: script, encoding: 'utf8', timeout: 120000, stdio: ['pipe', 'pipe', 'ignore'] });
    return parseOutput(out);
  } catch (e) { return { error: (e.message || 'failed').split('\n')[0] }; }
}
const runNode = (name, src) => runSub(process.execPath, ['-e', buildScript(name, src, true)], '');
function runQjs(name, src) {
  const tmp = path.join(require('os').tmpdir(), 'watjs-bench-' + name + '.js');
  fs.writeFileSync(tmp, buildScript(name, src, false));
  try { return runSub('qjs', [tmp]); } finally { try { fs.unlinkSync(tmp); } catch (_) {} }
}

// ---- main --------------------------------------------------------------------
(async () => {
  const argv = process.argv.slice(2);
  let jsonOut = null;
  const only = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--json') jsonOut = argv[++i];
    else only.push(argv[i]);
  }

  const files = fs.readdirSync(BENCH_DIR).filter(f => f.endsWith('.js'))
    .filter(f => !only.length || only.includes(f.replace(/\.js$/, '')));
  if (!files.length) { console.error('no bench files match'); process.exit(1); }

  const qjs = haveQjs();
  const engines = ['watjs', 'node'].concat(qjs ? ['qjs'] : []);
  console.log('watjs benchmarks — Computer Language Benchmarks Game macros');
  console.log('engines: ' + engines.join(', ') + (qjs ? '' : '   (qjs not found — install QuickJS to compare)'));
  console.log('timing: internal Date.now, auto-calibrated; ms per iteration (lower is better)\n');

  const rows = [];
  for (const file of files) {
    const name = file.replace(/\.js$/, '');
    const src = fs.readFileSync(path.join(BENCH_DIR, file), 'utf8');
    const r = { name, N: SIZES[name], watjs: await runWatjs(name, src), node: runNode(name, src) };
    if (qjs) r.qjs = runQjs(name, src);
    rows.push(r);
  }

  // table
  const pad = (s, n) => (s + ' '.repeat(n)).slice(0, n);
  const num = v => (v && v.ms != null) ? v.ms.toFixed(3) : (v && v.error ? 'ERR' : '—');
  const head = ['bench', 'N', 'watjs ms', 'node ms'].concat(qjs ? ['qjs ms'] : []).concat(['watjs/node', 'output']);
  const widths = [14, 7, 11, 11].concat(qjs ? [11] : []).concat([11, 8]);
  console.log(head.map((h, i) => pad(h, widths[i])).join(''));
  console.log(widths.map(w => '─'.repeat(w - 1) + ' ').join(''));
  for (const r of rows) {
    const agree = (r.watjs.cksum != null && r.node.cksum != null && r.watjs.cksum === r.node.cksum
      && (!qjs || r.qjs.cksum === r.watjs.cksum)) ? 'match' : (r.watjs.error ? '—' : 'DIFF');
    const ratio = (r.watjs.ms != null && r.node.ms != null && r.node.ms > 0) ? (r.watjs.ms / r.node.ms).toFixed(0) + '×' : '—';
    const cells = [pad(r.name, widths[0]), pad(String(r.N), widths[1]), pad(num(r.watjs), widths[2]), pad(num(r.node), widths[3])];
    let k = 4;
    if (qjs) cells.push(pad(num(r.qjs), widths[k++]));
    cells.push(pad(ratio, widths[k++]), pad(agree, widths[k]));
    console.log(cells.join(''));
    if (r.watjs.error) console.log('    watjs: ' + r.watjs.error);
  }
  console.log('\nnote: watjs is a WAT interpreter with no JIT — it optimizes for correctness/size, not speed.');

  if (jsonOut) { fs.writeFileSync(jsonOut, JSON.stringify(rows, null, 2)); console.log('\nwrote ' + jsonOut); }
})();

function haveQjs() { try { cp.execFileSync('qjs', ['-e', ''], { stdio: 'ignore' }); return true; } catch (_) { return false; } }

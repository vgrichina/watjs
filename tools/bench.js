#!/usr/bin/env node
// bench.js — run JavaScript benchmarks under watjs and, for comparison, Node and
// QuickJS (if installed). Prints a per-engine timing table.
//
// Two suites:
//   * CLBG  — verbatim Computer Language Benchmarks Game programs (bench/*.js).
//             Each is wrapped in a function that receives a fake process/console,
//             so its argv/output are captured without editing the algorithm.
//   * AWFY  — "Are We Fast Yet" (bench/awfy/*.js, MIT). CommonJS modules, bundled
//             in-script with a tiny `require` loader so the same code runs on every
//             engine. Each benchmark self-verifies its result.
//
// Timing is INTERNAL (Date.now, auto-calibrated to ~300ms), so engine start-up is
// excluded. Every engine runs the same problem size; output/verify is cross-checked.
//
// Usage:
//   node tools/bench.js                 # everything, every available engine
//   node tools/bench.js nbody queens    # only these
//   node tools/bench.js --json out.json # also write machine-readable results

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const BENCH_DIR = path.join(ROOT, 'bench');
const AWFY_DIR = path.join(BENCH_DIR, 'awfy');
const WASM = path.join(ROOT, 'watjs.wasm');

// ---- suite config ------------------------------------------------------------
// CLBG compute programs: size N (watjs ~0.3–1.5s/iter, no JIT).
const CLBG_COMPUTE = { nbody: 3000, spectralnorm: 40, fasta: 2000 };

const AWFY = ['queens', 'bounce', 'list', 'permute', 'sieve', 'storage', 'towers', 'richards', 'json', 'deltablue'];
const AWFY_SOM = new Set(['bounce', 'storage', 'deltablue', 'json']);
const AWFY_K = { deltablue: 50 }; // innerBenchmarkLoop arg; default 1 (calibrator repeats)

// ---- shared harness (prepended to every assembled script) --------------------
// `print` must exist: watjs & qjs native; Node gets a shim prepended per-engine.
const HARNESS = `
var __SUP = false, __H = 0;
function __hash(s){ for (var i = 0; i < s.length; i++) __H = (((__H<<5)-__H) + s.charCodeAt(i)) | 0; }
function __emit(s){ if (!__SUP) __hash("" + s); }
var __console = {
  log: function(){ var a=[]; for (var i=0;i<arguments.length;i++) a.push(""+arguments[i]); __emit(a.join(" ")); },
  error: function(){}, warn: function(){}, info: function(){}, debug: function(){}
};
function __capPrint(s){ __emit(s); }
function bench(name, fn){
  __SUP = false; __H = 0; fn();
  print("__CKSUM " + name + " " + (__H|0));
  __SUP = true;
  var reps = 1, ms = 0, t0;
  for (;;) {
    t0 = Date.now();
    for (var r = 0; r < reps; r++) fn();
    ms = Date.now() - t0;
    if (ms >= 300 || reps >= (1<<24)) break;
    reps *= 2;
  }
  print("__BENCH " + name + " " + (ms / reps) + " " + reps);
}
`;

const nodePrintShim = forNode => forNode ? 'var print=function(s){process.stdout.write(String(s)+"\\n");};\n' : '';

// ---- script builders ---------------------------------------------------------
function clbgComputeScript(name, forNode) {
  const src = fs.readFileSync(path.join(BENCH_DIR, name + '.js'), 'utf8');
  const N = CLBG_COMPUTE[name];
  return nodePrintShim(forNode) + HARNESS +
    '\nfunction __PROG(process, console, print, require){\n' + src + '\n}\n' +
    'function __mkproc(n){ return { argv:[null,null,""+n], stdout:{write:function(s){__emit(s);return true;}}, exit:function(){} }; }\n' +
    'bench(' + JSON.stringify(name) + ', function(){ __PROG(__mkproc(' + N + '), __console, __capPrint, function(){return{};}); });\n';
}

function awfyScript(name, forNode) {
  const read = f => fs.readFileSync(path.join(AWFY_DIR, f + '.js'), 'utf8');
  const K = AWFY_K[name] || 1;
  let mods = "__def('benchmark', function(module, exports, require){\n" + read('benchmark') + "\n});\n";
  if (AWFY_SOM.has(name)) mods += "__def('som', function(module, exports, require){\n" + read('som') + "\n});\n";
  mods += "__def(" + JSON.stringify(name) + ", function(module, exports, require){\n" + read(name) + "\n});\n";
  return nodePrintShim(forNode) + '(function(){\n' + HARNESS + `
var __mods = {};
function __def(n, f){ __mods[n] = { f: f, e: null, loaded: false }; }
function require(n){ n = (""+n).replace(/^\\.\\//, ""); var m = __mods[n]; if (!m.loaded){ m.loaded = true; var module = { exports: {} }; m.f(module, module.exports, require); m.e = module.exports; } return m.e; }
` + mods + `
var __b = require(${JSON.stringify(name)}).newInstance();
bench(${JSON.stringify('awfy:' + name)}, function(){ if (!__b.innerBenchmarkLoop(${K})) throw new Error("verify failed"); });
})();
`;
}

// ---- output parsing + engine drivers -----------------------------------------
function parseOutput(out) {
  const r = { ms: null, reps: null, cksum: null };
  for (const line of out.split('\n')) {
    let m;
    if ((m = line.match(/^__BENCH \S+ (\S+) (\d+)/))) { r.ms = parseFloat(m[1]); r.reps = parseInt(m[2], 10); }
    else if ((m = line.match(/^__CKSUM \S+ (-?\d+)/))) { r.cksum = m[1]; }
    else if (/^__THROW|^__PANIC/.test(line)) r.error = line.slice(2).trim();
  }
  if (r.ms == null && !r.error) r.error = 'no result';
  return r;
}

let _wasmMod = null;
async function runWatjs(script) {
  if (!_wasmMod) _wasmMod = await WebAssembly.compile(fs.readFileSync(WASM));
  const dec = new TextDecoder();
  let out = '', mem;
  const inst = await WebAssembly.instantiate(_wasmMod, { env: {
    print: (p, l) => { out += dec.decode(new Uint8Array(mem.buffer, p, l)) + '\n'; },
    host_throw: (p, l) => { out += '__THROW ' + dec.decode(new Uint8Array(mem.buffer, p, l)) + '\n'; },
    host_panic: (p, l) => { out += '__PANIC ' + dec.decode(new Uint8Array(mem.buffer, p, l)) + '\n'; },
    now_ms: () => Date.now(),
  }});
  const ex = inst.exports; mem = ex.memory;
  const enc = new TextEncoder().encode(script);
  const ptr = ex.alloc_input(enc.length);
  new Uint8Array(mem.buffer, ptr, enc.length).set(enc);
  const rc = ex.eval(ptr, enc.length);
  const r = parseOutput(out);
  if (rc !== 0 && !r.error && r.ms == null) r.error = 'eval rc=' + rc;
  return r;
}

function runSub(cmd, args, script) {
  try {
    const out = cp.execFileSync(cmd, args, { input: script, encoding: 'utf8', timeout: 180000, maxBuffer: 64 * 1024 * 1024, stdio: ['pipe', 'pipe', 'ignore'] });
    return parseOutput(out);
  } catch (e) { return { error: (e.message || 'failed').split('\n')[0] }; }
}
const runNode = script => runSub(process.execPath, ['-e', script], '');
function runQjs(tag, script) {
  const tmp = path.join(os.tmpdir(), 'watjs-bench-' + tag + '.js');
  fs.writeFileSync(tmp, script);
  try { return runSub('qjs', [tmp]); } finally { try { fs.unlinkSync(tmp); } catch (_) {} }
}
function haveQjs() { try { cp.execFileSync('qjs', ['-e', ''], { stdio: 'ignore' }); return true; } catch (_) { return false; } }

// QuickJS compiled to WebAssembly (via quickjs-emscripten) — an interpreter-in-wasm,
// the apples-to-apples peer for watjs (both sandboxed, neither JIT-compiled).
let _QJSW = null;
async function qjsWasmInit() {
  if (_QJSW !== null) return _QJSW;
  try { const { getQuickJS } = require('quickjs-emscripten'); _QJSW = await getQuickJS(); }
  catch (_) { _QJSW = false; }
  return _QJSW;
}
async function runQjsWasm(script) {
  const vm = _QJSW.newContext();
  let out = '';
  const p = vm.newFunction('print', (...args) => {
    out += args.map(a => { const v = vm.dump(a); return typeof v === 'string' ? v : String(v); }).join(' ') + '\n';
  });
  vm.setProp(vm.global, 'print', p); p.dispose();
  try {
    const r = vm.evalCode(script);
    if (r.error) { out += '__THROW ' + String(vm.dump(r.error)) + '\n'; r.error.dispose(); }
    else r.value.dispose();
  } catch (e) { vm.dispose(); return { error: String((e && e.message) || e) }; }
  vm.dispose();
  return parseOutput(out);
}

// ---- main --------------------------------------------------------------------
(async () => {
  const argv = process.argv.slice(2);
  let jsonOut = null; const only = [];
  for (let i = 0; i < argv.length; i++) { if (argv[i] === '--json') jsonOut = argv[++i]; else only.push(argv[i]); }
  const want = n => !only.length || only.includes(n);

  const qjs = haveQjs();
  const qjsw = !!(await qjsWasmInit());
  console.log('watjs benchmarks — CLBG macros + Are We Fast Yet');
  console.log('engines: watjs, node' + (qjs ? ', qjs (native)' : '') + (qjsw ? ', qjs-wasm' : ''));
  if (!qjs) console.log('  (install QuickJS for a native-qjs column)');
  if (!qjsw) console.log('  (npm i quickjs-emscripten for a qjs-in-wasm column)');
  console.log('timing: internal Date.now, auto-calibrated; ms per iteration, lower is better');
  console.log('watjs and qjs-wasm are both interpreters running inside WebAssembly — the fair peer comparison.\n');

  // build the task list
  const tasks = [];
  for (const n of Object.keys(CLBG_COMPUTE)) if (want(n)) tasks.push({ suite: 'CLBG', name: n, build: forNode => clbgComputeScript(n, forNode) });
  for (const n of AWFY) if (want(n) || want('awfy')) tasks.push({ suite: 'AWFY', name: n, build: forNode => awfyScript(n, forNode) });

  const rows = [];
  for (const t of tasks) {
    const r = { suite: t.suite, name: t.name };
    r.watjs = await runWatjs(t.build(false));
    r.node = runNode(t.build(true));
    if (qjs) r.qjs = runQjs(t.suite + '-' + t.name, t.build(false));
    if (qjsw) r.qjsw = await runQjsWasm(t.build(false));
    rows.push(r);
  }

  // table
  const pad = (s, n) => (String(s) + ' '.repeat(n)).slice(0, n);
  const num = v => (v && v.ms != null) ? (v.ms < 10 ? v.ms.toFixed(3) : v.ms.toFixed(1)) : (v && v.error ? 'ERR' : '—');
  const ratioLabel = qjsw ? 'watjs/qjsw' : 'watjs/node';
  const cols = ['bench', 'watjs ms', 'node ms']
    .concat(qjs ? ['qjs ms'] : []).concat(qjsw ? ['qjs-wasm'] : []).concat([ratioLabel, 'verify']);
  const w = [16, 11, 11].concat(qjs ? [11] : []).concat(qjsw ? [11] : []).concat([11, 8]);
  const line = () => console.log(w.map(x => '─'.repeat(x - 1) + ' ').join(''));
  let curSuite = '';
  console.log(cols.map((c, i) => pad(c, w[i])).join('')); line();
  for (const r of rows) {
    if (r.suite !== curSuite) { curSuite = r.suite; console.log(curSuite); }
    const engs = [r.watjs, r.node].concat(qjs ? [r.qjs] : []).concat(qjsw ? [r.qjsw] : []);
    const cksums = engs.map(e => e && e.cksum).filter(x => x != null);
    const verify = r.watjs.error ? '—' : (cksums.length && cksums.every(c => c === cksums[0]) ? 'match' : 'DIFF');
    const denom = qjsw ? r.qjsw : r.node;
    const ratio = (r.watjs.ms != null && denom && denom.ms > 0) ? (r.watjs.ms / denom.ms).toFixed(0) + '×' : '—';
    const cells = ['  ' + pad(r.name, w[0] - 2), pad(num(r.watjs), w[1]), pad(num(r.node), w[2])];
    let k = 3;
    if (qjs) cells.push(pad(num(r.qjs), w[k++]));
    if (qjsw) cells.push(pad(num(r.qjsw), w[k++]));
    cells.push(pad(ratio, w[k++]), pad(verify, w[k]));
    console.log(cells.join(''));
    if (r.watjs.error) console.log('      watjs: ' + r.watjs.error);
  }
  console.log('\nwatjs is a WAT interpreter with no JIT — it optimizes for correctness/size, not speed.');
  if (qjsw) console.log('vs qjs-wasm (interpreter-in-wasm peer): the watjs/qjsw column isolates the interpreter gap, not the JIT gap.');
  if (jsonOut) { fs.writeFileSync(jsonOut, JSON.stringify(rows, null, 2)); console.log('wrote ' + jsonOut); }
})();

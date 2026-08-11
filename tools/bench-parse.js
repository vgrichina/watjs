#!/usr/bin/env node
// bench-parse.js — parse/compile-throughput benchmark (front-end only, no execution).
//
// The compute benchmark (tools/bench.js) times steady-state execution and excludes
// parsing. This one does the opposite: it measures how fast each engine turns JS
// *source* into a callable, WITHOUT running it. The vehicle is `new Function(SRC)`
// on a large straight-line body that is constructed but never called — so the number
// is lex + parse + front-end compile, with zero execution in it.
//
// Why straight-line (no nested function declarations): V8/QuickJS lazily skip the
// bodies of nested functions during construction, which would understate their work
// and make the comparison meaningless. A flat statement body forces every engine to
// process all of it.
//
// Engine specifics:
//   * watjs has NO garbage collector (bump allocator), so it cannot re-parse in a
//     tight loop — memory only grows. We do ONE parse per FRESH wasm instance and
//     take the min over several instances. A single ~200KB parse survives easily.
//   * V8 (node) caches compilation keyed by source text, so repeatedly parsing the
//     SAME string measures a cache hit, not parsing. We defeat that by giving the
//     loop DISTINCT source variants (unique leading declaration per iteration).
//
// Metric: MB/s of source parsed (higher is better), plus raw ms.
//
// Usage:
//   node tools/bench-parse.js            # default ~200 KB corpus
//   node tools/bench-parse.js 400        # ~400 KB corpus (n blocks scaled)
//   node tools/bench-parse.js --json out.json

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const WASM = path.join(ROOT, 'watjs.wasm');

// ---- source corpus -----------------------------------------------------------
// A diverse straight-line block: literals, objects/arrays, ternary, template
// strings, a small loop, spread, destructuring, and an arrow in expression
// position — a realistic mix of what a parser must handle. Unique index `i`
// keeps every block distinct (no identifier reuse).
const BLOCK = i => `
  var a${i} = [1,2,3,4,${i}]; var b${i} = {p:${i}, q:"str${i}", r:[a${i}, ${i}*2]};
  var c${i} = a${i}.length > 2 ? b${i}.p + ${i} : b${i}.q; var d${i} = \`t\${a${i}[0]}-\${b${i}.p}\`;
  for (var k${i}=0;k${i}<3;k${i}++){ c${i} = (c${i} + k${i}) | 0; } var e${i} = (a${i} && b${i}) || c${i};
  var f${i} = { ...b${i}, extra:${i} }; var [g${i}, ...h${i}] = a${i}; var m${i} = a${i}.map(x => x + ${i});
`;

function genSource(targetKB) {
  // one BLOCK is ~0.35 KB; scale block count to hit the target size.
  const n = Math.max(1, Math.round((targetKB * 1024) / BLOCK(0).length));
  let s = '';
  for (let i = 0; i < n; i++) s += BLOCK(i);
  return s;
}

// ---- engine drivers ----------------------------------------------------------
function parseOutput(out) {
  const r = { ms: null, reps: null, ok: null };
  for (const line of out.split('\n')) {
    let m;
    if ((m = line.match(/^__PARSE (\S+) (\d+) (\S+)/))) { r.ms = parseFloat(m[1]); r.reps = parseInt(m[2], 10); r.ok = m[3]; }
    else if (/^__THROW|^__PANIC/.test(line)) r.error = line.slice(2).trim();
  }
  if (r.ms == null && !r.error) r.error = 'no result';
  return r;
}

const nodePrintShim = forNode => forNode ? 'var print=function(s){process.stdout.write(String(s)+"\\n");};\n' : '';

// Fast engines (GC): parse V distinct variants in one timed pass. Variants are
// built OUTSIDE the timer, so only parsing is measured; distinctness defeats V8's
// source-compilation cache.
function fastScript(SRC_LIT, V, forNode) {
  return nodePrintShim(forNode) + `
var BASE = ${SRC_LIT};
var variants = [];
for (var i = 0; i < ${V}; i++) variants.push("var __v" + i + "=" + i + ";\\n" + BASE);
var ok = (typeof new Function(variants[0])) === "function";
var t0 = Date.now();
for (var r = 0; r < ${V}; r++) { new Function(variants[r]); }
var ms = Date.now() - t0;
print("__PARSE " + ms + " ${V} " + ok);
`;
}

// watjs: ONE parse, internal timing (no loop — no GC to reclaim the parsed AST).
function watjsScript(SRC_LIT) {
  return `
var BASE = ${SRC_LIT};
var t0 = Date.now();
var f = new Function(BASE);
var ms = Date.now() - t0;
print("__PARSE " + ms + " 1 " + ((typeof f) === "function"));
`;
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
  let rc; try { rc = ex.eval(ptr, enc.length); } catch (e) { return { error: 'trap: ' + e.message }; }
  const r = parseOutput(out);
  if (rc !== 0 && !r.error && r.ms == null) r.error = 'eval rc=' + rc;
  return r;
}

function runSub(cmd, args, script) {
  try {
    const out = cp.execFileSync(cmd, args, { input: script, encoding: 'utf8', timeout: 180000, maxBuffer: 128 * 1024 * 1024, stdio: ['pipe', 'pipe', 'ignore'] });
    return parseOutput(out);
  } catch (e) { return { error: (e.message || 'failed').split('\n')[0] }; }
}
const runNode = script => runSub(process.execPath, ['-e', script], '');
function runQjs(script) {
  const tmp = path.join(os.tmpdir(), 'watjs-parsebench-' + process.pid + '.js');
  fs.writeFileSync(tmp, script);
  try { return runSub('qjs', [tmp]); } finally { try { fs.unlinkSync(tmp); } catch (_) {} }
}
function haveQjs() { try { cp.execFileSync('qjs', ['-e', ''], { stdio: 'ignore' }); return true; } catch (_) { return false; } }

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

// take the fastest (min ms) of K runs; least perturbed by GC/scheduler noise
function pickMin(results) {
  const ok = results.filter(r => r && r.ms != null && !r.error);
  if (!ok.length) return results.find(r => r && r.error) || { error: 'no result' };
  return ok.reduce((a, b) => (b.ms < a.ms ? b : a));
}

// ---- main --------------------------------------------------------------------
(async () => {
  const argv = process.argv.slice(2);
  let jsonOut = null, targetKB = 200;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--json') jsonOut = argv[++i];
    else if (/^\d+$/.test(argv[i])) targetKB = parseInt(argv[i], 10);
  }

  const SRC = genSource(targetKB);
  const SRC_BYTES = Buffer.byteLength(SRC, 'utf8');
  const SRC_LIT = JSON.stringify(SRC);
  const V = 64;                 // variant count for fast engines
  const K_WATJS = 9;            // fresh instances for watjs (min is noise-robust)
  const K_FAST = 3;             // repeats for fast engines

  const qjs = haveQjs();
  const qjsw = !!(await qjsWasmInit());

  console.log('watjs parse-throughput benchmark — front-end only (new Function, never called)');
  console.log('engines: watjs, node' + (qjs ? ', qjs (native)' : '') + (qjsw ? ', qjs-wasm' : ''));
  if (!qjs) console.log('  (install QuickJS for a native-qjs column)');
  if (!qjsw) console.log('  (npm i quickjs-emscripten for a qjs-in-wasm column)');
  console.log('corpus: ' + (SRC_BYTES / 1024).toFixed(1) + ' KB of straight-line JS; measures lex+parse+front-end compile, no execution');
  console.log('watjs = 1 parse / fresh instance (no GC), min of ' + K_WATJS + '; fast engines = ' + V + ' distinct variants (defeat compile cache), min of ' + K_FAST + '\n');

  // watjs: fresh instance each time (module cached, instance fresh inside runWatjs).
  // Warm up first so V8 tiers up the wasm module before we time (the first
  // instantiation runs cold/Liftoff and would inflate the earliest sample).
  await runWatjs(watjsScript(JSON.stringify(genSource(20))));
  await runWatjs(watjsScript(SRC_LIT));
  const watjsRuns = [];
  for (let i = 0; i < K_WATJS; i++) watjsRuns.push(await runWatjs(watjsScript(SRC_LIT)));
  const rWatjs = pickMin(watjsRuns);

  const fast = fastScript(SRC_LIT, V, false);
  const fastNode = fastScript(SRC_LIT, V, true);
  const nodeRuns = []; for (let i = 0; i < K_FAST; i++) nodeRuns.push(runNode(fastNode));
  const rNode = pickMin(nodeRuns);
  let rQjs = null, rQjsw = null;
  if (qjs) { const a = []; for (let i = 0; i < K_FAST; i++) a.push(runQjs(fast)); rQjs = pickMin(a); }
  if (qjsw) { const a = []; for (let i = 0; i < K_FAST; i++) a.push(await runQjsWasm(fast)); rQjsw = pickMin(a); }

  // MB/s = bytes-parsed / seconds. watjs parses SRC_BYTES once; fast engines V times.
  const mbps = (r, variants) => (r && r.ms > 0) ? ((SRC_BYTES * variants) / 1e6) / (r.ms / 1000) : null;
  const rows = [
    { engine: 'watjs',    r: rWatjs, variants: 1 },
    { engine: 'node',     r: rNode,  variants: V },
  ];
  if (qjs)  rows.push({ engine: 'qjs (native)', r: rQjs,  variants: V });
  if (qjsw) rows.push({ engine: 'qjs-wasm',     r: rQjsw, variants: V });
  for (const row of rows) row.mbps = mbps(row.r, row.variants);

  const pad = (s, n) => (String(s) + ' '.repeat(n)).slice(0, n);
  console.log(pad('engine', 16) + pad('ms/parse', 12) + pad('MB/s', 10) + pad('vs watjs', 10) + 'ok');
  console.log('─'.repeat(56));
  const wMbps = rows[0].mbps;
  for (const row of rows) {
    const perParse = row.r && row.r.ms != null ? (row.r.ms / row.variants) : null;
    const ratio = (row.mbps && wMbps) ? (row.mbps / wMbps).toFixed(1) + '×' : '—';
    console.log(
      pad(row.engine, 16) +
      pad(perParse != null ? perParse.toFixed(2) : (row.r && row.r.error ? 'ERR' : '—'), 12) +
      pad(row.mbps != null ? row.mbps.toFixed(1) : '—', 10) +
      pad(row.engine === 'watjs' ? '1×' : ratio, 10) +
      (row.r && row.r.ok ? row.r.ok : (row.r && row.r.error ? row.r.error : '?'))
    );
  }
  const qw = rows.find(r => r.engine === 'qjs-wasm');
  console.log('');
  if (qw && qw.mbps && wMbps) console.log('fair peer (both interpreters-in-wasm): watjs parses at ~1/' + (qw.mbps / wMbps).toFixed(0) + ' the rate of QuickJS-wasm.');
  console.log('note: front-end throughput only (no execution). Native engines also benefit from lazy inner-function compile and native codegen; read cross-engine numbers as approximate.');

  if (jsonOut) {
    fs.writeFileSync(jsonOut, JSON.stringify({ srcBytes: SRC_BYTES, variants: V, rows: rows.map(r => ({ engine: r.engine, ms: r.r && r.r.ms, variants: r.variants, mbps: r.mbps, ok: r.r && r.r.ok, error: r.r && r.r.error })) }, null, 2));
    console.log('wrote ' + jsonOut);
  }
})();

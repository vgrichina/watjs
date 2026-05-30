// Minimal test262 runner for watjs.
// Parses the /*--- ... ---*/ frontmatter, prepends harness includes (sta.js,
// assert.js, + any `includes:`), runs the test in watjs, and checks the result
// against the `negative` metadata.
//
// Usage: node tools/test262.js [file-or-dir ...]   (default: test262/cases)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const WASM = path.join(ROOT, 'watjs.wasm');
const HARNESS = path.join(ROOT, 'test262', 'harness');

function build() {
  execFileSync('node', [path.join(__dirname, 'build.js')], { stdio: ['ignore', 'ignore', 'inherit'] });
}

function parseFrontmatter(src) {
  const m = src.match(/\/\*---([\s\S]*?)---\*\//);
  const meta = { flags: [], includes: [], negative: null };
  if (!m) return meta;
  const y = m[1];
  const flags = y.match(/flags:\s*\[([^\]]*)\]/);
  if (flags) meta.flags = flags[1].split(',').map(s => s.trim()).filter(Boolean);
  const inc = y.match(/includes:\s*\[([^\]]*)\]/);
  if (inc) meta.includes = inc[1].split(',').map(s => s.trim()).filter(Boolean);
  else {
    const incBlock = y.match(/includes:\s*\n((?:\s*-\s*\S+\s*\n)+)/);
    if (incBlock) meta.includes = incBlock[1].split('\n').map(l => l.replace(/^\s*-\s*/, '').trim()).filter(Boolean);
  }
  const neg = y.match(/negative:\s*\n((?:\s+\S.*\n?)+)/);
  if (neg) {
    const t = neg[1].match(/type:\s*(\S+)/);
    const p = neg[1].match(/phase:\s*(\S+)/);
    meta.negative = { type: t ? t[1] : null, phase: p ? p[1] : null };
  }
  return meta;
}

function collect(targets) {
  const out = [];
  for (const t of targets) {
    const p = path.isAbsolute(t) ? t : path.join(ROOT, t);
    if (!fs.existsSync(p)) continue;
    if (fs.statSync(p).isDirectory())
      for (const n of fs.readdirSync(p).sort()) if (n.endsWith('.js')) out.push(path.join(p, n));
    else if (p.endsWith('.js')) out.push(p);
  }
  return out;
}

let wasmBytes;
async function runSource(src) {
  let thrown = null, panic = null, mem = null;
  const dec = new TextDecoder();
  const rd = (p, l) => dec.decode(new Uint8Array(mem.buffer, p, l));
  const imports = { env: {
    print: () => {}, host_throw: (p, l) => { thrown = rd(p, l); },
    host_panic: (p, l) => { panic = rd(p, l); }, now_ms: () => 0,
  }};
  let inst;
  try { ({ instance: inst } = await WebAssembly.instantiate(wasmBytes, imports)); }
  catch (e) { return { threw: true, reason: 'instantiate: ' + e.message }; }
  mem = inst.exports.memory;
  const bytes = Buffer.from(src);
  let rc;
  try {
    const ptr = inst.exports.alloc_input(bytes.length);
    new Uint8Array(mem.buffer, ptr, bytes.length).set(bytes);
    // Single engine: eval is the Phase-2 bytecode VM.
    rc = inst.exports.eval(ptr, bytes.length);
  } catch (e) { return { threw: true, reason: 'trap: ' + e.message }; }
  if (panic !== null) return { threw: true, reason: 'PANIC: ' + panic };
  return { threw: rc !== 0, reason: thrown };
}

(async () => {
  build();
  wasmBytes = fs.readFileSync(WASM);
  const targets = process.argv.slice(2);
  const files = collect(targets.length ? targets : ['test262/cases']);
  const sta = fs.readFileSync(path.join(HARNESS, 'sta.js'), 'utf8');
  const assertSrc = fs.readFileSync(path.join(HARNESS, 'assert.js'), 'utf8');

  let pass = 0, fail = 0, skip = 0;
  const fails = [];
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    const meta = parseFrontmatter(src);
    const rel = path.relative(ROOT, f);
    if (meta.flags.includes('module') || meta.flags.includes('async')) { skip++; console.log(`skip ${rel} (${meta.flags.join(',')})`); continue; }
    let full = '';
    if (!meta.flags.includes('raw')) {
      full += sta + '\n' + assertSrc + '\n';
      for (const inc of meta.includes) {
        const ip = path.join(HARNESS, inc);
        if (fs.existsSync(ip)) full += fs.readFileSync(ip, 'utf8') + '\n';
      }
    }
    // $MAX_ITERATIONS: test262 host hook for tail-call tests (substituted by the driver).
    full += src.replace(/\$MAX_ITERATIONS/g, '100000');
    const r = await runSource(full);
    const wantThrow = !!meta.negative;
    const ok = r.threw === wantThrow;
    if (ok) { pass++; console.log(`ok   ${rel}`); }
    else { fail++; fails.push({ rel, r, wantThrow }); console.log(`FAIL ${rel}  — ${wantThrow ? 'expected throw, none' : 'unexpected: ' + r.reason}`); }
  }
  console.log(`\n${pass} passed, ${fail} failed, ${skip} skipped  (of ${files.length})`);
  process.exit(fail ? 1 : 0);
})();

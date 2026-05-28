// Compile a WATX unit-test module (includes resolved from src/) and run every
// exported t_* probe, expecting each to return 1.
// Usage: node tools/run-units.js [module.watx]   (default test/units.watx)
const fs = require('fs');
const path = require('path');
const { compile } = require('./watx');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const entry = process.argv[2] || path.join(ROOT, 'test', 'units.watx');

const vfs = new Map();
for (const n of fs.readdirSync(SRC)) {
  if (n.endsWith('.watx')) vfs.set(n, fs.readFileSync(path.join(SRC, n), 'utf8'));
}

const r = compile(fs.readFileSync(entry, 'utf8'), vfs);
if (!r.success) { console.error('COMPILE FAIL:', r.error); process.exit(1); }

(async () => {
  const { instance } = await WebAssembly.instantiate(Uint8Array.from(r.wasmBinary), {
    env: { print: () => {}, host_throw: () => {}, host_panic: () => {}, now_ms: () => 0 },
  });
  let pass = 0, fail = 0;
  for (const name of Object.keys(instance.exports).sort()) {
    if (!name.startsWith('t_')) continue;
    let ok;
    try { ok = instance.exports[name]() === 1; }
    catch (e) { ok = false; console.log(`FAIL ${name} — trap: ${e.message}`); fail++; continue; }
    if (ok) { pass++; console.log(`ok   ${name}`); }
    else { fail++; console.log(`FAIL ${name}`); }
  }
  console.log(`\n${pass}/${pass + fail} unit probes passed`);
  process.exit(fail ? 1 : 0);
})();

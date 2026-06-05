// Build watjs.wasm from src/main.watx (+ includes).
// Usage: node tools/build.js [entry.watx] [out.wasm]
const fs = require('fs');
const path = require('path');

// The WATX compiler's EMIT stage recurses per top-level statement, so the very
// large hand-written functions (e.g. $call_native, setup_globals) can overflow
// the default V8 stack. Re-exec once with a larger stack so the build is reliable.
if (!process.env.__WATX_BIGSTACK) {
  const { spawnSync } = require('child_process');
  const r = spawnSync(process.execPath, ['--stack-size=4000', __filename, ...process.argv.slice(2)],
    { stdio: 'inherit', env: { ...process.env, __WATX_BIGSTACK: '1' } });
  process.exit(r.status == null ? 1 : r.status);
}

const { compile } = require('./watx');

const SRC = path.join(__dirname, '..', 'src');
const entry = process.argv[2] || path.join(SRC, 'main.watx');
const out = process.argv[3] || path.join(__dirname, '..', 'watjs.wasm');

// Virtual filesystem for (include "name.watx") — keyed by basename and rel path.
const vfs = new Map();
function addDir(dir, base = '') {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = base ? base + '/' + name : name;
    if (fs.statSync(full).isDirectory()) { addDir(full, rel); continue; }
    if (!name.endsWith('.watx')) continue;
    const text = fs.readFileSync(full, 'utf8');
    vfs.set(rel, text);
    vfs.set(name, text); // also by bare basename for convenience
  }
}
addDir(SRC);

const source = fs.readFileSync(entry, 'utf8');
const result = compile(source, vfs);

if (!result.success) {
  console.error('BUILD FAILED at stage:', result.stages.map(s => s.name + (s.success ? '' : '✗')).join(' → '));
  console.error(result.error);
  process.exit(1);
}
fs.writeFileSync(out, Buffer.from(result.wasmBinary));
console.error(`OK: ${out} (${result.wasmBinary.length} bytes, ${result.importMeta.length} imports)`);
if (result.diagnostics && result.diagnostics.length) {
  const warns = result.diagnostics.filter(d => d.type === 'warning');
  if (warns.length) console.error(`  ${warns.length} warning(s)`);
}

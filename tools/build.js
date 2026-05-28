// Build watjs.wasm from src/main.watx (+ includes).
// Usage: node tools/build.js [entry.watx] [out.wasm]
const fs = require('fs');
const path = require('path');
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

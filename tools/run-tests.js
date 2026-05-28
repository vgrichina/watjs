// watjs test runner (headless, Node).
//
// Engine ABI:
//   imports env.print(ptr,len)       — write UTF-8 to captured stdout
//   imports env.host_throw(ptr,len)  — uncaught JS exception message
//   imports env.host_panic(ptr,len)  — fatal engine error (bug / OOM)
//   imports env.now_ms() -> f64      — Date.now()
//   export  memory
//   export  alloc_input(len) -> ptr  — reserve len bytes; host writes source there
//   export  eval(ptr,len) -> i32     — 0 = ok, 1 = uncaught throw
//
// A test passes when: eval returns 0 (no uncaught throw) AND, if a sibling
// `<name>.expected` file exists, captured stdout matches it exactly.
//
// Usage: node tools/run-tests.js [dir-or-file ...]   (default: test/)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const WASM = path.join(ROOT, 'watjs.wasm');

function build() {
  execFileSync('node', [path.join(__dirname, 'build.js')], { stdio: ['ignore', 'ignore', 'inherit'] });
}

function collect(targets) {
  const files = [];
  for (const t of targets) {
    const p = path.isAbsolute(t) ? t : path.join(ROOT, t);
    if (!fs.existsSync(p)) continue;
    if (fs.statSync(p).isDirectory()) {
      for (const n of fs.readdirSync(p).sort())
        if (n.endsWith('.js')) files.push(path.join(p, n));
    } else if (p.endsWith('.js')) files.push(p);
  }
  return files;
}

async function runOne(wasmBytes, file) {
  let out = '';
  let thrown = null;
  let panic = null;
  let mem = null;
  const dec = new TextDecoder();
  const readStr = (ptr, len) => dec.decode(new Uint8Array(mem.buffer, ptr, len));

  const imports = { env: {
    print: (ptr, len) => { out += readStr(ptr, len); },
    host_throw: (ptr, len) => { thrown = readStr(ptr, len); },
    host_panic: (ptr, len) => { panic = readStr(ptr, len); },
    now_ms: () => Date.now(),
  }};

  let instance;
  try {
    ({ instance } = await WebAssembly.instantiate(wasmBytes, imports));
  } catch (e) {
    return { ok: false, reason: 'instantiate: ' + e.message };
  }
  const ex = instance.exports;
  mem = ex.memory;

  const src = fs.readFileSync(file);
  let rc;
  try {
    const ptr = ex.alloc_input(src.length);
    new Uint8Array(mem.buffer, ptr, src.length).set(src);
    rc = ex.eval(ptr, src.length);
  } catch (e) {
    return { ok: false, reason: 'trap: ' + e.message, out };
  }
  if (panic !== null) return { ok: false, reason: 'PANIC: ' + panic, out };
  if (rc !== 0 || thrown !== null) return { ok: false, reason: 'uncaught: ' + (thrown || 'rc=' + rc), out };

  const expFile = file.replace(/\.js$/, '.expected');
  if (fs.existsSync(expFile)) {
    const exp = fs.readFileSync(expFile, 'utf8');
    if (out !== exp) return { ok: false, reason: 'output mismatch', out, exp };
  }
  return { ok: true, out };
}

(async () => {
  build();
  const wasmBytes = fs.readFileSync(WASM);
  const targets = process.argv.slice(2);
  const files = collect(targets.length ? targets : ['test']);
  if (!files.length) { console.log('no tests found'); return; }

  let pass = 0, fail = 0;
  const fails = [];
  for (const f of files) {
    const r = await runOne(wasmBytes, f);
    const rel = path.relative(ROOT, f);
    if (r.ok) { pass++; console.log(`ok   ${rel}`); }
    else { fail++; fails.push({ rel, r }); console.log(`FAIL ${rel}  — ${r.reason}`); }
  }
  console.log(`\n${pass}/${pass + fail} passed`);
  for (const { rel, r } of fails) {
    if (r.exp !== undefined) {
      console.log(`\n--- ${rel}\n  expected: ${JSON.stringify(r.exp)}\n  got:      ${JSON.stringify(r.out)}`);
    }
  }
  process.exit(fail ? 1 : 0);
})();

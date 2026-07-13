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
// Usage: node tools/run-tests.js [--jobs N] [dir-or-file ...]   (default: test/)
//
// By default the files are sharded across a pool of worker processes
// (os.cpus().length-1) — process-level parallelism avoids the GC pressure of
// re-instantiating the wasm hundreds of times in one long-lived process, and
// uses all cores. `--jobs 1` forces the original sequential single-process run.
// `--worker` is the internal child mode (runs a shard, emits a summary line).
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, fork } = require('child_process');

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

// Run a list of files sequentially in THIS process; print ok/FAIL lines.
async function runShard(wasmBytes, files) {
  let pass = 0, fail = 0;
  for (const f of files) {
    const r = await runOne(wasmBytes, f);
    const rel = path.relative(ROOT, f);
    if (r.ok) { pass++; console.log(`ok   ${rel}`); }
    else {
      fail++;
      console.log(`FAIL ${rel}  — ${r.reason}`);
      if (r.exp !== undefined) console.log(`  expected: ${JSON.stringify(r.exp)}\n  got:      ${JSON.stringify(r.out)}`);
    }
  }
  return { pass, fail };
}

(async () => {
  const argv = process.argv.slice(2);

  // Child worker: files after '--worker' are this shard. Parent already built.
  if (argv[0] === '--worker') {
    const wasmBytes = fs.readFileSync(WASM);
    const { pass, fail } = await runShard(wasmBytes, argv.slice(1));
    console.log(`__SHARD__ ${pass} ${fail}`);
    process.exit(fail ? 1 : 0);
  }

  // Parse --jobs N.
  let jobs = Math.max(1, (os.cpus().length || 2) - 1);
  const targets = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--jobs' || argv[i] === '-j') { jobs = Math.max(1, parseInt(argv[++i], 10) || 1); }
    else targets.push(argv[i]);
  }

  build();
  const files = collect(targets.length ? targets : ['test']);
  if (!files.length) { console.log('no tests found'); return; }

  // Sequential path (small runs / --jobs 1) — original single-process behavior.
  if (jobs === 1 || files.length < 2 * jobs) {
    const wasmBytes = fs.readFileSync(WASM);
    const { pass, fail } = await runShard(wasmBytes, files);
    console.log(`\n${pass}/${pass + fail} passed`);
    process.exit(fail ? 1 : 0);
  }

  // Parallel: shard files round-robin across `jobs` worker processes.
  const shards = Array.from({ length: jobs }, () => []);
  files.forEach((f, i) => shards[i % jobs].push(f));
  const self = __filename;
  let pass = 0, fail = 0, done = 0, exitFail = 0;
  await new Promise((resolve) => {
    for (const shard of shards) {
      if (!shard.length) { if (++done === shards.length) resolve(); continue; }
      const child = fork(self, ['--worker', ...shard], { stdio: ['ignore', 'pipe', 'inherit', 'ipc'] });
      let buf = '';
      child.stdout.on('data', (d) => { buf += d; });
      child.on('exit', (code) => {
        if (code) exitFail = 1;
        for (const line of buf.split('\n')) {
          const m = line.match(/^__SHARD__ (\d+) (\d+)$/);
          if (m) { pass += +m[1]; fail += +m[2]; }
          else if (line.length) console.log(line);
        }
        if (++done === shards.length) resolve();
      });
    }
  });
  console.log(`\n${pass}/${pass + fail} passed`);
  process.exit(fail || exitFail ? 1 : 0);
})();

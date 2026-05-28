// Run the whole watjs test suite: every test/*.watx unit module (probes named
// t_*) and every test/*.js end-to-end test. Exit non-zero on any failure.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const TEST = path.join(ROOT, 'test');
let failed = 0;

function run(label, args) {
  process.stdout.write(`\n## ${label}\n`);
  try {
    const out = execFileSync('node', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    process.stdout.write(out.split('\n').filter(l => !l.startsWith('[watx]') && !/^\s*\[\d+\]/.test(l)).join('\n'));
  } catch (e) {
    failed++;
    const out = (e.stdout || '') + (e.stderr || '');
    process.stdout.write(out.split('\n').filter(l => !l.startsWith('[watx]') && !/^\s*\[\d+\]/.test(l)).join('\n'));
  }
}

for (const f of fs.readdirSync(TEST).sort()) {
  if (f.endsWith('.watx')) run(`units: ${f}`, [path.join('tools', 'run-units.js'), path.join('test', f)]);
}
run('js tests', [path.join('tools', 'run-tests.js')]);

process.stdout.write(`\n${failed ? '✗ ' + failed + ' suite(s) FAILED' : '✓ all suites passed'}\n`);
process.exit(failed ? 1 : 0);

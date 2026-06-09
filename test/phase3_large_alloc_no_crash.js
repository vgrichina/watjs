// Building moderately-large strings/arrays must not trap (the WASM memory max was
// 512 pages / 32MB; cumulative allocations from += / push exhausted it → OOB).
var s = "";
for (var i = 0; i < 10000; i++) s += ".";
assert(s.length === 10000, "10000-char string via +=");
assert("x".repeat(20000).length === 20000, "repeat 20000");
assert("ab".repeat(10000).length === 20000, "repeat multi-char");
var a = [];
for (var j = 0; j < 100000; j++) a.push(j);
assert(a.length === 100000, "100000-element array via push");
assert(a[99999] === 99999, "array element preserved");
// huge sizes still throw RangeError, not trap
function rng(f) { try { f(); return false; } catch (e) { return e instanceof RangeError; } }
assert(rng(function () { "x".repeat(2 ** 31); }), "huge repeat → RangeError");

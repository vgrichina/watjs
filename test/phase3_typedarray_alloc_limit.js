// A TypedArray length whose byte size is too large to allocate → RangeError, not trap.
function throwsRange(f) { try { f(); return false; } catch (e) { return e instanceof RangeError; } }
assert(throwsRange(function () { new Uint8Array(2 ** 40); }), "Uint8Array(2^40)");
assert(throwsRange(function () { new Float64Array(2 ** 30); }), "Float64Array(2^30)");
assert(throwsRange(function () { new Int32Array(Number.MAX_SAFE_INTEGER); }), "Int32Array(MAX_SAFE_INTEGER)");
// normal sizes still allocate and work
var a = new Uint8Array(4); a[0] = 255; assert(a[0] === 255, "u8 element");
var f = new Float64Array(3); f[1] = 1.5; assert(f[1] === 1.5, "f64 element");
assert(new Int32Array([1, 2, 3]).length === 3, "from array");

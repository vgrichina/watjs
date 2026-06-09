// An ArrayBuffer byteLength too large to allocate must throw RangeError, not trap.
function throwsRange(f) { try { f(); return false; } catch (e) { return e instanceof RangeError; } }
assert(throwsRange(function () { new ArrayBuffer(Number.MAX_SAFE_INTEGER); }), "huge AB → RangeError");
assert(throwsRange(function () { new ArrayBuffer(2 ** 53); }), "2^53 AB → RangeError");
assert(throwsRange(function () { new ArrayBuffer(2 ** 31); }), "2^31 AB → RangeError");
// normal sizes still allocate
assert(new ArrayBuffer(0).byteLength === 0, "empty AB");
assert(new ArrayBuffer(16).byteLength === 16, "16-byte AB");
assert(new ArrayBuffer(1024).byteLength === 1024, "1KB AB");

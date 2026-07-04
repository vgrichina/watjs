// new TypedArray(buffer, byteOffset, length): the check byteOffset + length*elementSize > byteLength
// must not overflow i32 for a large length — otherwise it builds an out-of-bounds view.
function isRange(f) { try { f(); return false; } catch (e) { return e instanceof RangeError; } }
var buf = new ArrayBuffer(16);
if (!isRange(function () { new Uint32Array(buf, 8, 1e9); })) throw new Error("huge length must RangeError");
if (!isRange(function () { new Uint32Array(buf, 8, 3); })) throw new Error("8+12>16 must RangeError");
if (!isRange(function () { new Float64Array(buf, 0, 1e9); })) throw new Error("f64 huge length");

// valid views work
if (new Uint32Array(buf, 8, 2).length !== 2) throw new Error("8+8=16 ok");
if (new Uint32Array(buf, 0, 4).length !== 4) throw new Error("full view");
if (new Uint32Array(buf, 16, 0).length !== 0) throw new Error("empty at end");
if (new Uint8Array([1, 2, 3, 4, 5]).length !== 5) throw new Error("from array");
if (new Float64Array(new ArrayBuffer(8)).length !== 1) throw new Error("auto length");
// TypedArray.prototype.set(source, offset): offset+srcLen > targetLen must not overflow i32.
if (!isRange(function () { new Uint32Array(4).set([1, 2], 2147483647); })) throw new Error("set huge offset");
if (!isRange(function () { new Uint32Array(4).set([1, 2], 3); })) throw new Error("set 3+2>4");
var sa = new Uint32Array(4); sa.set([7, 8], 2);
if (sa[2] !== 7 || sa[3] !== 8) throw new Error("valid set");

print("ok");

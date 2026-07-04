// DataView get/set bounds check (getIndex + elementSize > viewSize) must not overflow i32 for a
// large-but-in-ToIndex-range byteOffset — the overflow made the check pass and read out of bounds.
var dv = new DataView(new ArrayBuffer(8));
function isRange(f) { try { f(); return false; } catch (e) { return e instanceof RangeError; } }
if (!isRange(function () { dv.getInt32(1e10); })) throw new Error("getInt32(1e10) must RangeError");
if (!isRange(function () { dv.getFloat64(1e10); })) throw new Error("getFloat64(1e10)");
if (!isRange(function () { dv.getBigInt64(1e10); })) throw new Error("getBigInt64(1e10)");
if (!isRange(function () { dv.setInt32(1e10, 5); })) throw new Error("setInt32(1e10)");
if (!isRange(function () { dv.getInt32(2147483645); })) throw new Error("getInt32(2^31-3)");

// valid reads/writes still work, including exact boundary
dv.setInt32(0, 305419896);
if (dv.getInt32(0) !== 305419896) throw new Error("valid getInt32(0)");
if (dv.getInt32(4) !== 0) throw new Error("getInt32(4) at boundary");
if (!isRange(function () { dv.getInt32(5); })) throw new Error("getInt32(5) just past end");
if (dv.getInt8(7) !== 0) throw new Error("getInt8(7) last byte");
print("ok");

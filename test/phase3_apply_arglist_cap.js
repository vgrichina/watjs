// Function.prototype.apply / Reflect.apply / Reflect.construct build the argument list from an
// array-like's length via CreateListFromArrayLike; an excessive length (ToIndex caps at 2^31-1)
// overflowed the n*8 allocation and read/wrote out of bounds. It must throw RangeError, not trap.
function isRange(f) { try { f(); return false; } catch (e) { return e instanceof RangeError; } }
if (!isRange(function () { (function () {}).apply(null, { length: 1e9 }); })) throw new Error("apply huge");
if (!isRange(function () { Reflect.apply(function () {}, null, { length: 1e9 }); })) throw new Error("Reflect.apply huge");
if (!isRange(function () { Reflect.construct(function () {}, { length: 1e9 }); })) throw new Error("Reflect.construct huge");

// normal usage still works
if (Math.max.apply(null, [3, 1, 4, 1, 5, 9, 2, 6]) !== 9) throw new Error("apply normal");
if ((function (a, b, c) { return a + b + c; }).apply(null, [10, 20, 30]) !== 60) throw new Error("apply array");
if (Reflect.apply(Math.min, null, [5, 2, 8]) !== 2) throw new Error("Reflect.apply normal");
if (Reflect.construct(Array, [1, 2, 3]).length !== 3) throw new Error("Reflect.construct normal");
if ((function () { return arguments.length; }).apply(null, new Array(1000).fill(0)) !== 1000) throw new Error("1000 args");
print("ok");

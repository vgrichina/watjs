// The ArrayBuffer constructor performs GetArrayBufferMaxByteLengthOption(options): if options is an
// object with a defined maxByteLength, it is ToIndex'd (RangeError for excessive/negative/non-integer)
// and byteLength must be <= it — validated even where resizable buffers aren't otherwise modelled.
function isRange(f) { try { f(); return false; } catch (e) { return e instanceof RangeError; } }
if (!isRange(function () { new ArrayBuffer(0, { maxByteLength: 9007199254740992 }); })) throw new Error("2^53 excessive");
if (!isRange(function () { new ArrayBuffer(0, { maxByteLength: -1 }); })) throw new Error("negative");
if (!isRange(function () { new ArrayBuffer(0, { maxByteLength: Infinity }); })) throw new Error("Infinity");
if (!isRange(function () { new ArrayBuffer(16, { maxByteLength: 8 }); })) throw new Error("byteLength > max");

// maxByteLength is read via [[Get]] and ToIndex'd (valueOf observed)
var order = [];
new ArrayBuffer(4, { maxByteLength: { valueOf: function () { order.push("v"); return 8; } } });
if (order.join() !== "v") throw new Error("valueOf not invoked once");

// valid / absent options do not throw
new ArrayBuffer(8, { maxByteLength: 16 });
new ArrayBuffer(8);
new ArrayBuffer(8, null);
new ArrayBuffer(8, { maxByteLength: undefined });
print("ok");

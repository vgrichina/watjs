// Proxy [[GetOwnProperty]] (IsCompatiblePropertyDescriptor): a trap cannot report a target property
// that is NON-configurable as configurable, nor flip its enumerable attribute.
var target = Object.freeze({ x: 1 }); // x: non-configurable, non-writable, enumerable:true
function isTE(f) { try { f(); return false; } catch (e) { return e instanceof TypeError; } }

if (!isTE(function () {
  Object.getOwnPropertyDescriptor(new Proxy(target, { getOwnPropertyDescriptor: function () { return { configurable: true, writable: false, enumerable: true, value: 1 }; } }), "x");
})) throw new Error("reporting non-configurable as configurable must throw");

if (!isTE(function () {
  Object.getOwnPropertyDescriptor(new Proxy(target, { getOwnPropertyDescriptor: function () { return { configurable: false, writable: false, enumerable: false, value: 1 }; } }), "x");
})) throw new Error("flipping enumerable of a non-configurable prop must throw");

// faithful report is fine
var d = Object.getOwnPropertyDescriptor(new Proxy(target, { getOwnPropertyDescriptor: function () { return { configurable: false, writable: false, enumerable: true, value: 1 }; } }), "x");
if (!d || d.configurable !== false || d.enumerable !== true || d.value !== 1) throw new Error("faithful descriptor");

// a CONFIGURABLE target property may be reported however the trap likes
var d2 = Object.getOwnPropertyDescriptor(new Proxy({ y: 2 }, { getOwnPropertyDescriptor: function () { return { configurable: true, enumerable: false, writable: true, value: 9 }; } }), "y");
if (d2.value !== 9 || d2.enumerable !== false) throw new Error("configurable target report");

// ordinary proxy gopd unaffected
if (Object.getOwnPropertyDescriptor(new Proxy({ a: 1 }, {}), "a").value !== 1) throw new Error("plain proxy gopd");
print("ok");

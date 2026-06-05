// Object.prototype.toString consults @@toStringTag via the prototype chain
var ts = Object.prototype.toString;
print(ts.call(new Set()));
print(ts.call(new Map()));
print(ts.call(new WeakMap()));
print(ts.call(new WeakSet()));
print(ts.call([]));
print(ts.call(function(){}));
print(ts.call({}));
// own @@toStringTag still wins
var o = {}; o[Symbol.toStringTag] = "Custom";
print(ts.call(o));

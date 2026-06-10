// Promise.prototype.then/catch require a Promise receiver — else TypeError (not a
// trap from reading promise-internal state off a non-promise).
var p = new Promise(function () {});
function throwsType(f) { try { f(); return false; } catch (e) { return e instanceof TypeError; } }
assert(throwsType(function () { p.then.call(3, function () {}, function () {}); }), "then on number");
assert(throwsType(function () { p.then.call({}, function () {}); }), "then on plain object");
assert(throwsType(function () { p.then.call(null, function () {}); }), "then on null");
assert(throwsType(function () { p.catch.call("x", function () {}); }), "catch on string");
// normal then/catch still work
var got;
Promise.resolve(42).then(function (v) { got = v; });
assert(typeof Promise.resolve(1).then === "function", "then is callable");

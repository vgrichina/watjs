// Deferred promise resolution: a resolve/reject called AFTER the executor returns must
// still settle the promise and run reactions registered with .then while it was pending.
// (Was: resolve/reject wrote a single global read only at construction → handlers dropped.)
var out = {};

// resolve called later
var R; var p1 = new Promise(function (r) { R = r; });
p1.then(function (v) { out.a = v; });
R(9);
if (out.a !== 9) throw new Error("deferred resolve: " + out.a);

// reject called later
var J; var p2 = new Promise(function (res, rej) { J = rej; });
p2.then(null, function (e) { out.b = e; });
J("boom");
if (out.b !== "boom") throw new Error("deferred reject: " + out.b);

// chaining through a deferred promise
var R3; var p3 = new Promise(function (r) { R3 = r; });
p3.then(function (v) { return v + 1; }).then(function (v) { out.c = v; });
R3(10);
if (out.c !== 11) throw new Error("deferred chain: " + out.c);

// resolving with a promise adopts its state
var R4; var p4 = new Promise(function (r) { R4 = r; });
p4.then(function (v) { out.d = v; });
R4(Promise.resolve(7));
if (out.d !== 7) throw new Error("adopt promise: " + out.d);

// multiple reactions on the same pending promise
var R5; var p5 = new Promise(function (r) { R5 = r; });
var hits = 0;
p5.then(function () { hits++; });
p5.then(function () { hits++; });
R5(1);
if (hits !== 2) throw new Error("multiple reactions: " + hits);

// resolve is one-shot: a second resolve/reject is ignored
var R6, J6; var p6 = new Promise(function (r, j) { R6 = r; J6 = j; });
p6.then(function (v) { out.e = v; }, function () { out.e = "rejected"; });
R6(42); R6(99); J6("late");
if (out.e !== 42) throw new Error("one-shot resolve: " + out.e);

// synchronous resolve still works
new Promise(function (r) { r(5); }).then(function (v) { out.f = v; });
if (out.f !== 5) throw new Error("sync resolve: " + out.f);

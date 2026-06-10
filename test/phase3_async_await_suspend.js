// async functions suspend on `await` of a PENDING promise and resume when it settles
// (was: await unwrapped only already-settled promises → pending gave undefined).
// Reactions fire eagerly here, so resolving synchronously drives the continuation.
var out = {};

// await a deferred promise
var R; var p = new Promise(function (r) { R = r; });
(async function () { out.a = await p; })();
R(9);
if (out.a !== 9) throw new Error("await deferred: " + out.a);

// await a deferred rejection → throws into the async body (catchable)
var J; var pr = new Promise(function (res, rej) { J = rej; });
(async function () { try { await pr; } catch (e) { out.b = e; } })();
J("boom");
if (out.b !== "boom") throw new Error("await rejected: " + out.b);

// two sequential awaits of deferred promises
var R1, R2;
var p1 = new Promise(function (r) { R1 = r; });
var p2 = new Promise(function (r) { R2 = r; });
(async function () { out.c = (await p1) + (await p2); })();
R1(3); R2(4);
if (out.c !== 7) throw new Error("two awaits: " + out.c);

// async function's returned value resolves its promise; returning a promise adopts it
(async function () { return 5; })().then(function (v) { out.d = v; });
if (out.d !== 5) throw new Error("async return: " + out.d);
(async function () { return Promise.resolve(8); })().then(function (v) { out.e = v; });
if (out.e !== 8) throw new Error("async return promise (adopt): " + out.e);

// await of a non-promise resumes inline with the value
(async function () { out.f = await 42; })();
if (out.f !== 42) throw new Error("await non-promise: " + out.f);

// the async result is a fresh Promise (not the awaited one)
var inner = Promise.resolve(1);
var result = (async function () { return inner; })();
if (typeof result.then !== "function") throw new Error("async returns a promise");

// Deferred promise resolution + microtask ordering. Runs as an async IIFE so it observes
// setTimeoutLike(fn): defer fn to a microtask (no real timers in this engine).
function setTimeoutLike(fn) { Promise.resolve().then(fn); }
// settled values correctly (the engine settles via the microtask queue). Prints PASS iff
// every check holds (.expected = "PASS"); a thrown check is caught and printed as FAIL.
function check(c, m) { if (!c) throw new Error(m); }
(async function () {
  var R; var p1 = new Promise(function (r) { R = r; });
  setTimeoutLike(function () { R(9); });
  check((await p1) === 9, "deferred resolve");

  var J; var p2 = new Promise(function (res, rej) { J = rej; });
  setTimeoutLike(function () { J("boom"); });
  var rej; try { await p2; } catch (e) { rej = e; }
  check(rej === "boom", "deferred reject");

  var R3; var p3 = new Promise(function (r) { R3 = r; });
  setTimeoutLike(function () { R3(10); });
  check((await p3.then(function (v) { return v + 1; })) === 11, "deferred chain");

  var R4; var p4 = new Promise(function (r) { R4 = r; });
  setTimeoutLike(function () { R4(Promise.resolve(7)); });
  check((await p4) === 7, "adopt promise");

  check((await new Promise(function (r) { r(5); })) === 5, "sync resolve");
  print("PASS");
})().then(undefined, function (e) { print("FAIL: " + e.message); });

// async functions suspend on await of a pending promise and resume when it settles.
function defer(v) { var R; var p = new Promise(function (r) { R = r; }); Promise.resolve().then(function () { R(v); }); return p; }
function deferReject(v) { var J; var p = new Promise(function (_, j) { J = j; }); Promise.resolve().then(function () { J(v); }); return p; }
function check(c, m) { if (!c) throw new Error(m); }
(async function () {
  check((await defer(9)) === 9, "await deferred");
  var rej; try { await deferReject("boom"); } catch (e) { rej = e; }
  check(rej === "boom", "await rejected");
  check(((await defer(3)) + (await defer(4))) === 7, "two awaits");
  check((await (async function () { return 5; })()) === 5, "async return");
  check((await (async function () { return Promise.resolve(8); })()) === 8, "async return promise (adopt)");
  check((await 42) === 42, "await non-promise");
  var r = (async function () { return 1; })();
  check(typeof r.then === "function", "async returns a promise");
  print("PASS");
})().then(undefined, function (e) { print("FAIL: " + e.message); });

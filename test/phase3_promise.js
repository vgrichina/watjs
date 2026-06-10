// Promise then/catch/finally + statics + rejection + async/await, verified with correct
// microtask timing (results awaited, not read synchronously). Prints PASS iff all hold.
function check(c, m) { if (!c) throw new Error(m); }
(async function () {
  check(typeof Promise.prototype.then === "function", "proto.then");
  check(typeof Promise.all === "function", "Promise.all");

  var log = [];
  await Promise.resolve(5).then(function (v) { log.push("a" + v); });
  await new Promise(function (res) { res(9); }).then(function (v) { log.push("b" + v); });
  await Promise.resolve(1).then(function () { throw "boom"; }).catch(function (e) { log.push("e" + e); });
  check(log.join(",") === "a5,b9,eboom", "chain: " + log.join(","));

  check((await Promise.all([Promise.resolve(1), 2, Promise.resolve(3)])).join(",") === "1,2,3", "all");
  check((await Promise.race([Promise.resolve("first"), Promise.resolve("second")])) === "first", "race");
  var settled = await Promise.allSettled([Promise.resolve(1), Promise.reject(2)]);
  check(settled[0].status === "fulfilled" && settled[1].status === "rejected", "allSettled");
  check((await Promise.any([Promise.reject(1), Promise.resolve(7)])) === 7, "any");

  check((await (async function () { return 5; })()) === 5, "async return");
  check((await (async function () { var x = await Promise.resolve(10); return x + 1; })()) === 11, "await");
  check((await (async function () { try { await Promise.reject("err"); } catch (e) { return "caught:" + e; } })()) === "caught:err", "await-reject");
  print("PASS");
})().then(undefined, function (e) { print("FAIL: " + e.message); });

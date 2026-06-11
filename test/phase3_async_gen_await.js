// async generators suspend on BOTH await and yield: `await` in the body, `for await` inside
// an async generator, `yield await`, and awaiting deferred promises all drive correctly.
function check(c, m) { if (!c) throw new Error(m); }
async function collect(ag) { var a = []; for await (var v of ag) a.push(v); return a; }
(async function () {
  async function* g1() { var x = await Promise.resolve(10); yield x + 1; yield x + 2; }
  check((await collect(g1())).join() === "11,12", "await then yield");

  async function* g2() { for await (var x of [1, 2, 3]) yield x * 2; }
  check((await collect(g2())).join() === "2,4,6", "for-await inside async gen");

  var R; var p = new Promise(function (r) { R = r; });
  async function* g3() { yield await p; yield 99; }
  var done = collect(g3());
  R(5);
  check((await done).join() === "5,99", "yield await deferred");

  async function* g4() { yield 1; yield 2; }  // no await
  check((await collect(g4())).join() === "1,2", "plain async gen");

  // interleaving: awaits between yields run in order
  var log = [];
  async function* g5() { log.push("a"); yield 1; log.push(await Promise.resolve("b")); yield 2; log.push("c"); }
  for await (var v of g5()) log.push("y" + v);
  check(log.join() === "a,y1,b,y2,c", "interleave: " + log.join());
  print("PASS");
})().then(undefined, function (e) { print("FAIL: " + e.message); });

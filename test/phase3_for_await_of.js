// for await (x of E): awaits each iteration. Works over sync iterables (each value awaited),
// promise-valued iterables, and async generators; supports break/continue and destructuring.
function check(c, m) { if (!c) throw new Error(m); }
async function* ag(n) { for (var i = 1; i <= n; i++) yield i; }
(async function () {
  var s = 0; for await (var x of [1, 2, 3]) s += x; check(s === 6, "sync iterable: " + s);

  s = 0; for await (var y of [Promise.resolve(1), Promise.resolve(2)]) s += y; check(s === 3, "promise values: " + s);

  s = 0; for await (var z of ag(4)) s += z; check(s === 10, "async generator: " + s);

  s = 0; for await (var b of [1, 2, 3, 4]) { if (b === 3) break; s += b; } check(s === 3, "break: " + s);

  s = 0; for await (var c of [1, 2, 3, 4]) { if (c % 2) continue; s += c; } check(s === 6, "continue: " + s);

  s = 0; for await (var [p, q] of [[1, 2], [3, 4]]) s += p + q; check(s === 10, "destructuring: " + s);

  // each iteration interleaves with awaits between elements
  var order = [];
  async function* tagged() { order.push("y1"); yield 1; order.push("y2"); yield 2; }
  for await (var v of tagged()) order.push("b" + v);
  check(order.join(",") === "y1,b1,y2,b2", "interleave: " + order.join(","));
  print("PASS");
})().then(undefined, function (e) { print("FAIL: " + e.message); });

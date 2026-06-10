// async generators: g.next() returns a Promise, object is its own Symbol.asyncIterator,
// class async/async* methods parse, a member named `async` is a normal method.
function check(c, m) { if (!c) throw new Error(m); }
(async function () {
  async function* ag() { yield 1; yield 2; }
  var g = ag();
  check(typeof g.next === "function", "no next");
  var p = g.next();
  check(typeof p.then === "function", "next() must return a Promise");
  check(typeof g[Symbol.asyncIterator] === "function", "no Symbol.asyncIterator");
  check(g[Symbol.asyncIterator]() === g, "asyncIterator must return this");
  var r = await p;
  check(r.value === 1 && r.done === false, "first yield: " + r.value);
  var cc = 0;
  class C { async *m([x = 23]) { if (x !== 23) throw new Error("x=" + x); cc++; } }
  await new C().m([undefined]).next();
  check(cc === 1, "class async*-method");
  class D { async am() { return 7; } }
  check((await new D().am()) === 7, "class async method");
  class E { async() { return 2; } }
  check(new E().async() === 2, "method named async");
  print("PASS");
})().then(undefined, function (e) { print("FAIL: " + e.message); });

// Object-literal async / async* methods (and async as a key/shorthand/method name).
function check(c, m) { if (!c) throw new Error(m); }
(async function () {
  var o = { async am() { return 5; }, async *ag() { yield 1; }, regular() { return 9; }, async: 7, normalProp: 3 };
  check(o.regular() === 9, "regular method");
  check(o.async === 7, "async-keyed property");
  check(o.normalProp === 3, "normalProp");
  check((await o.am()) === 5, "async method value");
  var g = o.ag();
  check(typeof g.next === "function", "async gen method has next");
  check(typeof g.next().then === "function", "async gen .next() is a Promise");
  var asyncBinding = 11;
  check(({ async: asyncBinding }).async === 11, "shorthand-like async key");
  check(({ async() { return 2; } }).async() === 2, "method named async");
  var key = "ck";
  var o2 = { async [key]() { return 8; } };
  check((await o2.ck()) === 8, "computed async method");
  print("PASS");
})().then(undefined, function (e) { print("FAIL: " + e.message); });

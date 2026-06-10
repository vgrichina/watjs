// Object-literal `async` / `async *` methods (were unparsed → "async is not defined").
// `async` as a property key, shorthand, or a method literally named `async` must still work.
var log = {};
var o = {
  async am() { return 5; },
  async *ag() { yield 1; },
  regular() { return 9; },
  async: 7,                       // property KEY named async
  normalProp: 3
};
if (o.regular() !== 9) throw new Error("regular method");
if (o.async !== 7) throw new Error("async-keyed property: " + o.async);
if (o.normalProp !== 3) throw new Error("normalProp");

var r = o.am();
if (typeof r.then !== "function") throw new Error("async method must return a Promise");
r.then(function (v) { log.am = v; });
if (log.am !== 5) throw new Error("async method value: " + log.am);

var g = o.ag();
if (typeof g.next !== "function") throw new Error("async gen method: no next");
if (typeof g.next().then !== "function") throw new Error("async gen .next() must be a Promise");

// shorthand { async } where async is a binding
var async = 11;
if (({ async }).async !== 11) throw new Error("shorthand async");

// a method literally named `async`
if (({ async() { return 2; } }).async() !== 2) throw new Error("method named async");

// computed async method
var key = "ck";
var o2 = { async [key]() { return 8; } };
var r2 = o2.ck();
if (typeof r2.then !== "function") throw new Error("computed async method must return a Promise");
r2.then(function (v) { log.ck = v; });
if (log.ck !== 8) throw new Error("computed async value: " + log.ck);

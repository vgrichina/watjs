// async generators: g.next()/return()/throw() return Promises, the object is its own
// Symbol.asyncIterator, and class `async`/`async *` methods parse (a member literally
// named `async` is still a normal method). (Were: async* compiled as a sync generator.)
var log = {};

async function* ag() { yield 1; yield 2; }
var g = ag();
if (typeof g.next !== "function") throw new Error("no next");
var p = g.next();
if (typeof p.then !== "function") throw new Error("next() must return a Promise");
if (typeof g[Symbol.asyncIterator] !== "function") throw new Error("no Symbol.asyncIterator");
if (g[Symbol.asyncIterator]() !== g) throw new Error("asyncIterator must return this");
p.then(function (r) { log.first = r.value + "/" + r.done; });
if (log.first !== "1/false") throw new Error("first yield: " + log.first);

// class async generator method with a destructuring/default param (no await in body)
var cc = 0;
class C { async *m([x = 23]) { if (x !== 23) throw new Error("x=" + x); cc++; } }
new C().m([undefined]).next().then(function () { log.cc = cc; });
if (log.cc !== 1) throw new Error("class async*-method: " + log.cc);

// class async method returns a Promise
class D { async am() { return 7; } }
var r = new D().am();
if (typeof r.then !== "function") throw new Error("async method must return a Promise");
r.then(function (v) { log.am = v; });
if (log.am !== 7) throw new Error("async method value: " + log.am);

// a method literally named `async` is a normal (sync) method, not a modifier
class E { async() { return 2; } }
if (new E().async() !== 2) throw new Error("method named async");

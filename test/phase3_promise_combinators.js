// Promise.all/race/any/allSettled iterate the iterable one item at a time via C.resolve
// (was: materialized the whole iterable first, hanging on infinite iterators). Also: the
// receiver must be a constructor, C.resolve is invoked per item, and iteration errors
// reject (closing the iterator).
var out = {};
Promise.all([1, 2, 3]).then(function (v) { out.all = v.join(); });
if (out.all !== "1,2,3") throw new Error("all: " + out.all);

Promise.all([Promise.resolve(5), 6]).then(function (v) { out.all2 = v[0] + "," + v[1]; });
if (out.all2 !== "5,6") throw new Error("all2: " + out.all2);

Promise.race([Promise.resolve("first"), Promise.resolve("second")]).then(function (v) { out.race = v; });
if (out.race !== "first") throw new Error("race: " + out.race);

Promise.any([Promise.reject(1), Promise.resolve("won")]).then(function (v) { out.any = v; });
if (out.any !== "won") throw new Error("any: " + out.any);

Promise.allSettled([Promise.resolve(1), Promise.reject(2)]).then(function (v) {
  out.settled = v[0].status + "/" + v[0].value + "," + v[1].status + "/" + v[1].reason;
});
if (out.settled !== "fulfilled/1,rejected/2") throw new Error("allSettled: " + out.settled);

Promise.all([Promise.reject("nope")]).then(function () { throw new Error("all should reject"); },
  function (e) { out.allRej = e; });
if (out.allRej !== "nope") throw new Error("all-reject: " + out.allRej);

// receiver must be a constructor → TypeError (eval is a non-constructor function)
var threw = false;
try { Promise.all.call(eval, []); } catch (e) { threw = e instanceof TypeError; }
if (!threw) throw new Error("non-constructor receiver must throw TypeError");

// a constructor whose .resolve throws → the result rejects, and the iterator is closed
var returnCount = 0;
function BadResolve() {}
BadResolve.resolve = function () { throw "boom"; };
var finiteIter = {
  [Symbol.iterator]() {
    var done = false;
    return { next() { if (done) return { done: true }; done = true; return { done: false, value: 1 }; },
             return() { returnCount += 1; return {}; } };
  }
};
var rejected;
Promise.all.call(BadResolve, finiteIter); // must not hang; rejects internally

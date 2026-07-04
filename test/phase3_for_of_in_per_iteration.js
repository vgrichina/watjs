// `for (let x of E)` and `for (let x in E)` block-scope x to the loop (no leak/clobber) and give
// each iteration a FRESH binding, so body closures capture per-iteration values. `for (var …)` keeps
// the single shared binding. All the non-local exits (continue/break/labeled-break/return/throw) and
// the iterator-close-on-break must still work.

// for-of closures capture per-iteration values
var fns = [];
for (let v of [10, 20, 30]) fns.push(function () { return v; });
if (fns.map(function (f) { return f(); }).join() !== "10,20,30") throw new Error("for-of per-iteration");

// for-in closures capture per-iteration keys
var kf = [];
for (let k in { x: 1, y: 2, z: 3 }) kf.push(function () { return k; });
if (kf.map(function (f) { return f(); }).join() !== "x,y,z") throw new Error("for-in per-iteration");

// var head still shares
var vs = [];
for (var v of [1, 2, 3]) vs.push(function () { return v; });
if (vs[0]() !== 3) throw new Error("for-of var shares");

// head does not leak past the loop
var leaked = false;
for (let v of [1]) {}
try { v; leaked = true; } catch (e) {}
if (leaked) throw new Error("for-of head leaked");

// continue: skipped iteration not captured
var cf = [];
for (let v of [1, 2, 3]) { if (v === 2) continue; cf.push(function () { return v; }); }
if (cf.map(function (f) { return f(); }).join() !== "1,3") throw new Error("continue");

// break: scope popped, no leak
var bf = [];
for (let v of [1, 2, 3]) { bf.push(function () { return v; }); if (v === 2) break; }
if (bf.map(function (f) { return f(); }).join() !== "1,2") throw new Error("break");

// break closes the iterator
var closed = false;
var it = { [Symbol.iterator]() { return { next() { return { value: 1, done: false }; }, return() { closed = true; return {}; } }; } };
for (let v of it) { break; }
if (!closed) throw new Error("break did not close the iterator");

// labeled break out of a nested for-of
var m = 0;
L: for (let i of [0, 1]) { for (let j of [0, 1]) { if (j === 1) break L; m++; } }
if (m !== 1) throw new Error("labeled break: " + m);

// return out of a for-of
function ret() { for (let v of [1, 2, 3]) { if (v === 2) return v; } }
if (ret() !== 2) throw new Error("return");

// throw out of a for-of does not leak the binding
var t = "outer";
try { for (let t of [1]) { throw 1; } } catch (e) {}
if (t !== "outer") throw new Error("throw leaked: " + t);

// destructuring for-of still works (falls back to non-per-iteration)
var s = "";
for (let [a, b] of [[1, 2], [3, 4]]) s += a + b;
if (s !== "37") throw new Error("destructuring for-of: " + s);

print("ok");

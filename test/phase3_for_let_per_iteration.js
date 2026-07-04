// A `for (let i…; …; …)` head is block-scoped to the loop (no leak/clobber of an outer binding),
// AND each iteration gets a FRESH binding (CreatePerIterationEnvironment), so closures created in the
// body capture per-iteration values, not the final one. `for (var …)` keeps the single shared binding.

// closures capture per-iteration values
var fns = [];
for (let i = 0; i < 3; i++) fns.push(function () { return i; });
if (fns[0]() !== 0 || fns[1]() !== 1 || fns[2]() !== 2) throw new Error("per-iteration: " + fns.map(function (f) { return f(); }));

// var head still shares a single binding
var vs = [];
for (var v = 0; v < 3; v++) vs.push(function () { return v; });
if (vs[0]() !== 3) throw new Error("var head should share: " + vs[0]());

// for-head let does not leak past the loop
var leaked = false;
for (let i = 0; i < 1; i++) {}
try { i; leaked = true; } catch (e) {}
if (leaked) throw new Error("for-let head leaked");

// for-head let/const shadows (does not clobber) an outer binding of the same name
let x = "outer";
for (const x = "inner"; false;) {}
if (x !== "outer") throw new Error("for-const head clobbered outer: " + x);

// nested for-let: each level is per-iteration
var g = [];
for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) g.push(function () { return i * 10 + j; });
if (JSON.stringify(g.map(function (f) { return f(); })) !== "[0,1,10,11]") throw new Error("nested per-iteration");

// continue and break interact correctly with the per-iteration scope
var h = [];
for (let i = 0; i < 4; i++) { h.push(function () { return i; }); if (i === 1) continue; if (i === 2) break; }
if (JSON.stringify(h.map(function (f) { return f(); })) !== "[0,1,2]") throw new Error("continue/break per-iteration: " + h.map(function (f) { return f(); }));

// labeled break out of nested for-let doesn't corrupt the outer scope
var m = 0;
outer: for (let i = 0; i < 3; i++) { for (let j = 0; j < 3; j++) { if (j === 1) break outer; m++; } }
if (m !== 1) throw new Error("labeled break: " + m);

// var declared in a for-let body still hoists to the function scope
function bodyVar() { for (let i = 0; i < 1; i++) { var w = 7; } return w; }
if (bodyVar() !== 7) throw new Error("body var hoist");

// return out of a for-let works (scope popped)
function ret() { for (let i = 0; i < 5; i++) { if (i === 2) return i; } }
if (ret() !== 2) throw new Error("return out of for-let");

print("ok");

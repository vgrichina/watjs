// Trailing comma in a parameter list ends the list (a `)` after the comma is not
// a parameter). Previously a single-param trailing comma added a bogus param,
// corrupting body parsing for some functions (esp. generators).
function f(x,) { return x; }
assert(f(5) === 5, "fn single param trailing comma");
function g(a, b,) { return a + b; }
assert(g(2, 3) === 5, "fn multi param trailing comma");

var cc = 0;
function* gen(a,) { if (a !== 42) throw new Error("a=" + a); cc++; }
gen(42, 99).next();
assert(cc === 1, "generator single-param trailing comma runs body");
assert(gen.length === 1, "trailing comma not counted in length");

function* g2(a, b,) { yield a + b; }
assert(g2(1, 2).next().value === 3, "generator multi-param trailing comma");

var o = { m(x,) { return x * 2; } };
assert(o.m(4) === 8, "method trailing comma");

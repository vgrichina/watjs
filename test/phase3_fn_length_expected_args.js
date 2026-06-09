// Function .length = ExpectedArgumentCount: the number of parameters before the
// first one with a default value or the rest parameter.
assert((function (a, b, c) {}).length === 3, "plain params");
assert((function () {}).length === 0, "no params");
assert((function (a, b = 1, c) {}).length === 1, "default stops count");
assert((function (a, ...b) {}).length === 1, "rest stops count");
assert((function (a = 1) {}).length === 0, "first param default");
assert(((a, b) => a).length === 2, "arrow plain");
assert(((a, b = 1) => a).length === 1, "arrow default");
var o = { m(a, b, c = 1) {} };
assert(o.m.length === 2, "method default");
function* g(a, b = 1) {}
assert(g.length === 1, "generator default");
class C { constructor(a, b) {} }
assert(C.length === 2, "class ctor");
class D {}
assert(D.length === 0, "empty class");
class E extends C {}
assert(E.length === 0, "derived class");

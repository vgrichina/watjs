// Logical-assignment (||= &&= ??=) and **= as EXPRESSIONS (value-producing), plus
// name inference for `x ||= <anon fn>`.
var v;
v = undefined; assert((v ||= 1) === 1 && v === 1, "||= undefined");
v = null;      assert((v ??= 2) === 2 && v === 2, "??= null");
v = 0;         assert((v ||= 3) === 3, "||= 0 (falsy)");
v = 5;         assert((v ||= 9) === 5 && v === 5, "||= truthy short-circuits");
v = 5;         assert((v &&= 9) === 9 && v === 9, "&&= truthy");
v = 0;         assert((v &&= 9) === 0 && v === 0, "&&= falsy short-circuits");
v = 7;         assert((v ??= 1) === 7, "??= non-null short-circuits");
// **= as expression
var n = 3;     assert((n **= 2) === 9 && n === 9, "**= expression");
// name inference (statement and expression forms)
var f; f ||= function () {}; assert(f.name === "f", "||= name inference (stmt)");
var g; var gr = (g ??= function () {}); assert(g.name === "g", "??= name inference (expr)");

// for-in RHS is an Expression (comma operator allowed): `for (x in A, B)`
// evaluates A (discarded) then B and enumerates B.
var k, n = 0;
for (k in null, { key: 0 }) n++;
assert(k === 'key' && n === 1, "comma in for-in RHS enumerates last operand");

var last, count = 0;
for (var p in (0, 0), { a: 1, b: 2 }) { last = p; count++; }
assert(count === 2 && last === 'b', "var head + comma RHS");

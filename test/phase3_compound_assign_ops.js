// All compound-assignment operators (previously only += -= *= /= **= were lexed;
// %= &= |= ^= <<= >>= >>>= were missing entirely).
var x;
x = -1; assert((x %= 2) === -1 && x === -1, "%=");
x = 6;  assert((x &= 3) === 2 && x === 2, "&=");
x = 5;  assert((x |= 2) === 7 && x === 7, "|=");
x = 5;  assert((x ^= 1) === 4 && x === 4, "^=");
x = 1;  assert((x <<= 4) === 16 && x === 16, "<<=");
x = 256;assert((x >>= 2) === 64 && x === 64, ">>=");
x = -1; assert((x >>>= 28) === 15 && x === 15, ">>>=");
x = 2;  assert((x **= 3) === 8 && x === 8, "**=");
// member and index targets
var o = { v: 7 }; o.v &= 3; assert(o.v === 3, "obj.key &=");
var a = [12]; a[0] %= 5; assert(a[0] === 2, "arr[i] %=");
var b = { n: 1 }; b.n <<= 5; assert(b.n === 32, "obj.key <<=");
// chained / precedence
var c = 10; c += 5; c *= 2; assert(c === 30, "+= then *=");

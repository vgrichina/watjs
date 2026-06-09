// strict: `for (var eval = 42 in null)` is a SyntaxError. The engine reports it as
// a thrown SyntaxError. A wrapping function compiled in strict mode must fail.
// Non-strict var/let/const for-heads and normal loops are unaffected.
var ok = 0;
for (var i = 0; i < 3; i++) ok++;
assert(ok === 3, "regular for loop works");
var n = 0; for (var v of [1, 2]) n += v; assert(n === 3, "for-of works");
var keys = ''; for (var k in { a: 1, b: 2 }) keys += k; assert(keys === 'ab', "for-in works");

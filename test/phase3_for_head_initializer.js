// The new "for-of/for-in head may not have an initializer" SyntaxError check must not
// break valid loops (regular-for with an initializer, for-of, for-in, parenthesized init).
var s = 0; for (var i = 0; i < 3; i++) s += i;
if (s !== 3) throw new Error("regular for: " + s);
var m = 0; for (var v of [1, 2, 3]) m += v;
if (m !== 6) throw new Error("for-of: " + m);
var keys = ''; for (var k in { a: 1, b: 2 }) keys += k;
if (keys !== 'ab') throw new Error("for-in: " + keys);
var p = 0; for (let w = (1, 2); w < 3; w++) p++;
if (p !== 1) throw new Error("paren init regular-for: " + p);
var t = 0; for (let u = 5; t < u - 2; t++) {}
if (t !== 3) throw new Error("let init regular-for: " + t);

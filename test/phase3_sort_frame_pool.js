// Array.sort with a comparator no longer exhausts the heap on mid-size arrays
// (the per-call operand stack is recycled). Closures (which capture the SCOPE,
// not the operand stack) are unaffected.
var a = [];
for (var i = 0; i < 200; i++) a.push((200 - i) % 97);
a.sort(function (x, y) { return x - y; });
if (a[0] !== 0 || a[a.length - 1] !== 96) throw new Error("sort result");
for (var k = 1; k < a.length; k++) if (a[k] < a[k - 1]) throw new Error("not sorted at " + k);
// closures still capture per-call scope correctly
function mk() { var x = 10; return function () { return x++; }; }
var f = mk();
if (f() !== 10 || f() !== 11 || f() !== 12) throw new Error("closure state");
var fns = [];
for (var j = 0; j < 5; j++) { (function (m) { fns.push(function () { return m; }); })(j); }
if (fns.map(function (g) { return g(); }).join() !== "0,1,2,3,4") throw new Error("captured loop var");
print("ok");

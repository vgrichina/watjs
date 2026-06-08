// Array.prototype methods work on a FUNCTION receiver (array-like: own length = arity,
// indexed own props), not only objects/arrays.
var fn = function (a, b) { return a + b; };
fn[1] = true;
if (Array.prototype.lastIndexOf.call(fn, true) !== 1) throw new Error("lastIndexOf");
if (Array.prototype.indexOf.call(fn, true) !== 1) throw new Error("indexOf");
var count = 0;
Array.prototype.forEach.call(fn, function () { count++; });
if (count !== 1) throw new Error("forEach (only present index 1)"); // fn[0] is absent
var g = function (x, y, z) {}; g[0] = 10; g[2] = 30;
var sum = Array.prototype.reduce.call(g, function (a, v) { return a + v; }, 0);
if (sum !== 40) throw new Error("reduce: " + sum);
// real arrays + plain array-likes still work
if ([1, 2, 3, 2].lastIndexOf(2) !== 3) throw new Error("real array");
if (Array.prototype.indexOf.call({ 0: "a", 1: "b", length: 2 }, "b") !== 1) throw new Error("object array-like");
print("ok");

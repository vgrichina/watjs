var s = 0;
for (var x of [10, 20, 30]) s += x;
assert(s === 60, "for-of array");
var keys = "";
for (var k in { a: 1, b: 2, c: 3 }) keys += k;
assert(keys === "abc", "for-in object");
var chars = "";
for (var ch of "hi") chars += ch;
assert(chars === "hi", "for-of string");
var t = 0;
for (var v of [1, 2, 3, 4, 5]) { if (v === 3) continue; if (v === 5) break; t += v; }
assert(t === 7, "for-of break/continue");
var idx = "";
for (var i in [9, 8, 7]) idx += i;
assert(idx === "012", "for-in array indices");
print("for-of/in tests passed");

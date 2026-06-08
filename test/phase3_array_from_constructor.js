// Array.from uses `this` as a constructor when custom: array-like → Construct(C,[len]),
// iterator → Construct(C) (no args); then CreateDataProperty each element + Set length.
if (JSON.stringify(Array.from([1, 2, 3])) !== "[1,2,3]") throw new Error("array");
if (JSON.stringify(Array.from("ab")) !== '["a","b"]') throw new Error("string");
if (JSON.stringify(Array.from([1, 2], function (x) { return x * 2; })) !== "[2,4]") throw new Error("mapFn");
if (JSON.stringify(Array.from({ length: 2, 0: "x", 1: "y" })) !== '["x","y"]') throw new Error("array-like");
// custom constructor (array-like source) — receives [len]
var lens = [];
function MyArr(len) { lens.push(len); this.len = len; }
var r = Array.from.call(MyArr, ["a", "b", "c"]);
if (r.len !== 3 || r[0] !== "a" || r[2] !== "c" || r.length !== 3) throw new Error("custom array-like");
// iterator source + custom ctor: constructed with no args (no crash)
var r2 = Array.from.call(MyArr, new Set([7, 8]));
if (r2[0] !== 7 || r2[1] !== 8) throw new Error("custom iterator");
print("ok");

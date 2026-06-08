// Array.prototype.flat: an explicitly-undefined depth defaults to 1 (like no arg);
// a non-numeric depth coerces via ToIntegerOrInfinity (NaN/string → 0).
if (JSON.stringify([1, [2]].flat(undefined)) !== "[1,2]") throw new Error("undefined depth → 1");
if (JSON.stringify([1, [2]].flat()) !== "[1,2]") throw new Error("no arg → 1");
if (JSON.stringify([1, [2]].flat("TestString")) !== "[1,[2]]") throw new Error("non-numeric → 0");
if (JSON.stringify([1, [2]].flat(NaN)) !== "[1,[2]]") throw new Error("NaN → 0");
if (JSON.stringify([1, [2, [3]]].flat(2)) !== "[1,2,3]") throw new Error("depth 2");
if (JSON.stringify([1, [2, [3]]].flat(Infinity)) !== "[1,2,3]") throw new Error("Infinity");
print("ok");

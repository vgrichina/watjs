// Object spread {...src} copies own ENUMERABLE symbol-keyed properties (after string keys),
// and skips non-enumerable ones (CopyDataProperties).
var s = Symbol("foo");
var src = { a: 1 }; src[s] = 2;
Object.defineProperty(src, Symbol("hidden"), { value: 9, enumerable: false });
var copy = { ...src };
if (copy.a !== 1) throw new Error("string key");
if (copy[s] !== 2) throw new Error("symbol key not copied");
if (Object.getOwnPropertySymbols(copy).length !== 1) throw new Error("non-enumerable symbol must be skipped");
// string keys preserved in order
var o2 = { z: 1, a: 2 }; o2[Symbol("k")] = 3;
var c2 = { ...o2 };
if (Object.keys(c2).join(",") !== "z,a") throw new Error("string order");
if (Object.getOwnPropertySymbols(c2).length !== 1) throw new Error("symbol count");
print("ok");

// Array.sort uses a stable O(n log n) merge sort: large arrays sort without
// exhausting the heap, ties preserve insertion order, comparator errors propagate.
if ([3, 1, 2].sort(function (a, b) { return a - b; }).join() !== "1,2,3") throw new Error("numeric");
if ([10, 9, 1, 100, 2].sort(function (a, b) { return a - b; }).join() !== "1,2,9,10,100") throw new Error("multi-digit");
if (["b", "a", "c"].sort().join() !== "a,b,c") throw new Error("default string");
// stability
var items = [{ k: "a", v: 1 }, { k: "b", v: 2 }, { k: "a", v: 3 }, { k: "b", v: 4 }, { k: "a", v: 5 }];
items.sort(function (x, y) { return x.k < y.k ? -1 : x.k > y.k ? 1 : 0; });
if (items.map(function (o) { return o.k + o.v; }).join() !== "a1,a3,a5,b2,b4") throw new Error("not stable");
// large array sorts correctly without crashing
var a = []; for (var i = 0; i < 2048; i++) a.push((i * 7919) % 2048);
a.sort(function (x, y) { return x - y; });
if (a[0] !== 0 || a[2047] !== 2047 || a[1024] !== 1024) throw new Error("2048-element sort");
// comparator throw propagates
var threw = false; try { [3, 1, 2].sort(function () { throw new TypeError("c"); }); } catch (e) { threw = e instanceof TypeError; }
if (!threw) throw new Error("comparator throw");
print("ok");

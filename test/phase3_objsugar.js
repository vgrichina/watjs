var k = "dyn";
var o = { [k]: 5, ["a" + "b"]: 6, normal: 7 };
assert(o.dyn === 5 && o.ab === 6 && o.normal === 7, "computed keys");
var x = 1, y = 2, z = 3;
var p = { x, y, z };
assert(p.x === 1 && p.y === 2 && p.z === 3, "shorthand");
var mixed = { a: 10, x, [k]: 20 };
assert(mixed.a === 10 && mixed.x === 1 && mixed.dyn === 20, "mixed");
print("object sugar tests passed");

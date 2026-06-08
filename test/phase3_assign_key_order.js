// Object.assign copies own enumerable string keys (insertion order) THEN symbol keys.
var sx = Symbol("x"), sy = Symbol("y");
var order = [];
var src = {};
Object.defineProperty(src, sx, { get() { order.push("sx"); return 1; }, enumerable: true });
Object.defineProperty(src, "a", { get() { order.push("a"); return 1; }, enumerable: true });
Object.defineProperty(src, sy, { get() { order.push("sy"); return 1; }, enumerable: true });
Object.defineProperty(src, "b", { get() { order.push("b"); return 1; }, enumerable: true });
Object.assign({}, src);
if (order.join() !== "a,b,sx,sy") throw new Error("order: " + order.join());
// values still copied correctly
var c = Object.assign({}, { a: 1 }, { [sx]: 9 });
if (c.a !== 1 || c[sx] !== 9) throw new Error("values");
print("ok");

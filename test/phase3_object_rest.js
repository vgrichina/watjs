var { a, ...r } = { a: 1, b: 2, c: 3 };
print("var=" + a + "|" + JSON.stringify(r));
var { x, y, ...z } = { x: 1, y: 2, p: 3, q: 4 };
print("multi=" + x + y + "|" + JSON.stringify(z));
function f({ a, ...rest }) { return a + ":" + JSON.stringify(rest); }
print("param=" + f({ a: 1, b: 2, c: 3 }));
var { ...all } = { m: 5, n: 6 };
print("all=" + JSON.stringify(all));
var src = { k: 1 }; Object.defineProperty(src, "hidden", { value: 9, enumerable: false });
var { ...vis } = src;
print("non-enum-excluded=" + JSON.stringify(vis));

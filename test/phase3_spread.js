var a = [1, 2, 3];
assert([0, ...a, 4].join(",") === "0,1,2,3,4", "array spread");
assert([...a, ...a].length === 6, "double spread");
assert(Math.max(...a) === 3, "call spread");
assert(Math.max(10, ...a, 5) === 10, "mixed spread");
function add3(x, y, z) { return x + y + z; }
assert(add3(...a) === 6, "fn spread args");
var copy = [...a];
copy.push(4);
assert(a.length === 3 && copy.length === 4, "spread copies");
print("spread tests passed");

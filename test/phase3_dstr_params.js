// Destructuring parameters in functions and arrows.
function fa([x, y]) { return x + y; }
print("arr=" + fa([3, 4]));

function fo({ a, b }) { return a * b; }
print("obj=" + fo({ a: 2, b: 5 }));

// element default + object property default
print("arr-def=" + (function ([x = 9]) { return x; })([]));
print("obj-def=" + (function ({ p = 7 }) { return p; })({}));

// object rename
print("rename=" + (function ({ k: v }) { return v; })({ k: 8 }));

// array rest in pattern
print("rest=" + (function ([h, ...t]) { return t.length; })([1, 2, 3, 4]));

// param-level default on a pattern
print("param-def=" + (function ([z] = [11]) { return z; })());

// nested patterns
print("nested-arr=" + (function ([[a], b]) { return a + b; })([[1], 2]));
print("nested-obj=" + (function ({ o: { q } }) { return q; })({ o: { q: 6 } }));

// arrows
print("arrow=" + (([m, n]) => m - n)([10, 3]));
print("arrow-obj=" + (({ w }) => w)({ w: 42 }));

// mixed with a plain param
function mix(first, { s }) { return first + s; }
print("mix=" + mix("a", { s: "b" }));

// var/let destructuring, including nested (now shares the param emitter)
var [[g], h] = [[1], 2];
print("var-nested=" + g + h);
var { o: { q: qq } } = { o: { q: 4 } };
print("var-nested-obj=" + qq);
let [i1, ...rest] = [1, 2, 3];
print("var-rest=" + i1 + "," + rest.length);

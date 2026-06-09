// for-loop init supports destructuring binding patterns.
var out = [];
for (const [a, b] = [10, 20]; out.length < 1;) { out.push(a, b); }
if (out.join(",") !== "10,20") throw "array pattern: " + out;
var o2 = [];
for (var {x, y} = {x: 1, y: 2}; o2.length < 1;) { o2.push(x, y); }
if (o2.join(",") !== "1,2") throw "object pattern: " + o2;
var o3 = [];
for (let [p, ...rest] = [1, 2, 3, 4]; o3.length < 1;) { o3.push(p, rest.join("")); }
if (o3.join(",") !== "1,234") throw "rest pattern: " + o3;
// nested + default
var o4 = [];
for (const [{m = 9}] = [{}]; o4.length < 1;) { o4.push(m); }
if (o4.join(",") !== "9") throw "nested default: " + o4;
// plain for-init still works
var s = 0; for (var i = 0; i < 3; i++) s += i;
if (s !== 3) throw "plain for-init: " + s;
// the destructured init binding is usable across iterations
var sum = 0; for (var [step] = [2]; sum < 6;) { sum += step; }
if (sum !== 6) throw "loop with destructured init: " + sum;
print("ok");

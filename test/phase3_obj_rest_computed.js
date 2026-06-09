// Object rest excludes ALL destructured keys, including computed and numeric ones.
var {a, ...r1} = {a:1, b:2, c:3};
if (a !== 1 || JSON.stringify(r1) !== '{"b":2,"c":3}') throw "static: "+JSON.stringify(r1);
var k = "b";
var {[k]: x, ...r2} = {a:1, b:2, c:3};
if (x !== 2 || JSON.stringify(r2) !== '{"a":1,"c":3}') throw "computed: "+JSON.stringify(r2);
var {[1]: y, ...r3} = {1:"one", 2:"two"};
if (y !== "one" || JSON.stringify(r3) !== '{"2":"two"}') throw "number: "+JSON.stringify(r3);
// multiple computed + static
var {[("a")]: p, q, ...r4} = {a:1, q:2, x:3, y:4};
if (p !== 1 || q !== 2 || JSON.stringify(r4) !== '{"x":3,"y":4}') throw "mixed: "+JSON.stringify(r4);
// rest-only
var {...all} = {p:1, q:2};
if (JSON.stringify(all) !== '{"p":1,"q":2}') throw "rest-only";
// no rest (plain object destructuring unaffected)
var {m, n} = {m:5, n:6, o:7};
if (m !== 5 || n !== 6) throw "no-rest";
// assignment form
var obj = {}; var rr; ({a: obj.aa, ...rr} = {a:1, z:9});
if (obj.aa !== 1 || JSON.stringify(rr) !== '{"z":9}') throw "assign-rest";
print("ok");

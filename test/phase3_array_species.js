// map/filter use ArraySpeciesCreate: a custom constructor[@@species] builds the result.
function p(n, v) { print(n + "=" + v); }

// default: plain Array
p("map", [1, 2, 3].map(function (x) { return x * 2; }).join(","));        // 2,4,6
p("filter", [1, 2, 3, 4].filter(function (x) { return x % 2; }).join(",")); // 1,3
p("isArr", Array.isArray([1].map(function (x) { return x; })));            // true

// custom @@species → result is what the species constructor returns
var a = [1, 2, 3];
a.constructor = {};
a.constructor[Symbol.species] = function (n) { var o = []; o.tag = "S"; return o; };
var m = a.map(function (x) { return x * 10; });
p("species-map", m.tag + "," + m.join(","));        // S,10,20,30
var f = a.filter(function (x) { return x > 1; });
p("species-filter", f.tag + "," + f.join(","));     // S,2,3

// holes stay absent in map's result
p("map-holes", (1 in [1, , 3].map(function (x) { return x; }))); // false

// a non-constructor species throws TypeError
var b = [1]; b.constructor = {}; b.constructor[Symbol.species] = 42;
p("bad-species", (function () { try { b.map(function (x) { return x; }); return "no"; } catch (e) { return e.constructor.name; } })()); // TypeError

// slice also uses ArraySpeciesCreate
p("slice", [1, 2, 3, 4, 5].slice(1, 3).join(","));  // 2,3
p("slice-holes", (0 in [1, , 3].slice(1, 2)));       // false
var c = [1, 2, 3, 4]; c.constructor = {}; c.constructor[Symbol.species] = function (n) { var o = []; o.tag = "S"; return o; };
var s = c.slice(1, 3); p("species-slice", s.tag + "," + s.join(",")); // S,2,3

// concat also uses ArraySpeciesCreate
var d = [1, 2]; d.constructor = {}; d.constructor[Symbol.species] = function (n) { var o = []; o.tag = "S"; return o; };
var cc = d.concat([3, 4]); p("species-concat", cc.tag + "," + cc.join(",")); // S,1,2,3,4
p("concat-len", [1, 2].concat([3, 4]).length); // 4

// Array(n) / new Array(n) must create n HOLES, not a trailing undefined.
function p(n, v) { print(n + "=" + v); }

var a = new Array(5);
p("len", a.length);                 // 5
p("0in", 0 in a);                   // false
p("lastin", 4 in a);                // false (was wrongly true)
p("hasOwn-last", a.hasOwnProperty(4)); // false

var fe = 0; a.forEach(function () { fe++; }); p("forEach", fe); // 0
p("reduce-throws", (function () { try { a.reduce(function () {}); return "no"; } catch (e) { return e.constructor.name; } })()); // TypeError
p("join", a.join(","));             // ",,,," (4 commas, all empty)
p("mapLen", a.map(function (x) { return 1; }).length); // 5 (holes preserved)

// filling makes them present
a[2] = "x";
p("after-set", (2 in a) + "," + (0 in a)); // true,false

// map/filter throw RangeError when the source length exceeds 2^32-1
// (ArraySpeciesCreate -> ArrayCreate); forEach must NOT (it builds no result).
function thr(n, fn) { try { fn(); print(n + "=NOTHROW"); } catch (e) { print(n + "=" + e.constructor.name); } }
thr("map-huge", function () { Array.prototype.map.call({ length: Infinity }, function () {}); });
thr("filter-huge", function () { Array.prototype.filter.call({ length: Math.pow(2, 32) }, function () {}); });
var feN = 0; [1, 2].forEach(function () { feN++; }); p("forEach-normal", feN);

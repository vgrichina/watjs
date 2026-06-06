// Array.prototype methods ToObject a primitive `this` (boolean/number/string).
function p(n, v) { print(n + "=" + v); }

Boolean.prototype[0] = true; Boolean.prototype.length = 1;
var r = Array.prototype.map.call(false, function (v, i, o) { return o instanceof Boolean; });
p("map-bool", r[0] + "," + r.length);   // true,1
delete Boolean.prototype[0]; delete Boolean.prototype.length;

// string receiver: indices are the chars, length is the string length
p("map-str", Array.prototype.map.call("ab", function (c) { return c.toUpperCase(); }).join(",")); // A,B
p("filter-str", Array.prototype.filter.call("abc", function (c) { return c !== "b"; }).join(",")); // a,c
var cnt = 0; Array.prototype.forEach.call("xy", function () { cnt++; }); p("forEach-str", cnt); // 2
p("indexOf-str", Array.prototype.indexOf.call("abc", "b")); // 1

// null/undefined receiver still throws
p("null", (function () { try { Array.prototype.map.call(null, function () {}); return "no"; } catch (e) { return e.constructor.name; } })()); // TypeError

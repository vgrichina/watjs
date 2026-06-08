// JSON.parse uses CreateDataProperty — "__proto__" becomes an own enumerable data
// property, NOT a [[Prototype]] mutation (it must not invoke the __proto__ setter).
var x = JSON.parse('{"__proto__":[1,2]}');
if (!Array.isArray(x.__proto__)) throw "__proto__ should be an own array";
if (Object.getPrototypeOf(x) !== Object.prototype) throw "prototype must be unchanged";
if (!x.hasOwnProperty("__proto__")) throw "own property";
// duplicate keys: last wins, still an own data prop
var y = JSON.parse('{"__proto__":1,"__proto__":2}');
if (y.__proto__ !== 2) throw "duplicate __proto__";
if (Object.getPrototypeOf(y) !== Object.prototype) throw "dup prototype unchanged";
// ordinary keys unaffected
if (Object.keys(JSON.parse('{"a":1,"b":2}')).join(",") !== "a,b") throw "ordinary keys";
if (JSON.stringify(JSON.parse('{"x":{"y":3}}')) !== '{"x":{"y":3}}') throw "roundtrip";
print("ok");

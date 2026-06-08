// Reflect.deleteProperty returns the [[Delete]] result: true for a configurable own
// prop (and deletes it) or a missing prop; false for a non-configurable own prop.
var o = {}; o.p1 = "foo";
if (Reflect.deleteProperty(o, "p1") !== true) throw "delete configurable returns true";
if (o.hasOwnProperty("p1")) throw "configurable prop should be gone";
if (Reflect.deleteProperty(o, "missing") !== true) throw "missing prop returns true";
o.p2 = "foo"; Object.freeze(o);
if (Reflect.deleteProperty(o, "p2") !== false) throw "non-configurable returns false";
if (!o.hasOwnProperty("p2")) throw "non-configurable prop should remain";
// a defineProperty non-configurable prop
var d = {}; Object.defineProperty(d, "x", { value: 1, configurable: false });
if (Reflect.deleteProperty(d, "x") !== false) throw "defineProperty non-config";
if (!d.hasOwnProperty("x")) throw "stays";
print("ok");

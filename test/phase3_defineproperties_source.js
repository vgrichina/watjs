// Object.defineProperties reads property descriptors from a function or array
// Properties argument (its own enumerable props), not only a plain object.
var data = "data";
var descFun = function () {}; descFun.prop = { set: function (v) { data = v; }, configurable: true };
var o = {}; Object.defineProperties(o, descFun);
o.prop = "funData";
if (!o.hasOwnProperty("prop") || data !== "funData") throw new Error("function source");
var data2 = "data";
var descArr = []; descArr.prop = { set: function (v) { data2 = v; }, configurable: true };
var o2 = {}; Object.defineProperties(o2, descArr);
o2.prop = "arrData";
if (data2 !== "arrData") throw new Error("array source");
// plain object source still works
var o3 = {}; Object.defineProperties(o3, { a: { value: 1 }, b: { value: 2 } });
if (o3.a !== 1 || o3.b !== 2) throw new Error("object source");
print("ok");

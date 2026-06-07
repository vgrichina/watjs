// ToString of an array/function honors an overridden toString (OrdinaryToPrimitive),
// not a hardcoded join / "function".
if (String([1, 2, 3]) !== "1,2,3") throw new Error("default array");
if (`${[4, 5]}` !== "4,5") throw new Error("template array");
if ("a" + [1, 2] !== "a1,2") throw new Error("concat array");
var ap = Array.prototype.toString;
Array.prototype.toString = function () { return "__ARR__"; };
try {
  if (String([1, 2]) !== "__ARR__") throw new Error("override array toString");
} finally { Array.prototype.toString = ap; }
var f = function g() {};
f.toString = function () { return "SHIFTED"; };
if (String(f) !== "SHIFTED") throw new Error("override function toString");
print("ok");

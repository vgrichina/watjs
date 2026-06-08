// Function.prototype.apply: CreateListFromArrayLike — arrays, arguments objects,
// array-likes ({length,0,1}); null/undefined → no args; non-object → TypeError.
function f(){ return Array.prototype.slice.call(arguments).join(","); }
if (f.apply(null, [1,2,3]) !== "1,2,3") throw "array";
if (f.apply(null, {length:2, 0:"a", 1:"b"}) !== "a,b") throw "array-like";
function g(){ return f.apply(null, arguments); }
if (g(7,8,9) !== "7,8,9") throw "arguments object";
if (f.apply(null) !== "") throw "no argArray";
if (f.apply(null, null) !== "") throw "null argArray";
if (f.apply(null, undefined) !== "") throw "undefined argArray";
var t=false; try { f.apply(null, 5); } catch(e){ t = e instanceof TypeError; }
if (!t) throw "non-object argArray must throw";
// length is coerced via ToLength; fractional/negative clamp
if (f.apply(null, {length:2.9, 0:"x", 1:"y", 2:"z"}) !== "x,y") throw "ToLength";
print("ok");

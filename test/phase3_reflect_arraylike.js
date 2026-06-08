// Reflect.apply / Reflect.construct use CreateListFromArrayLike on the argumentsList:
// array, arguments, array-like ({length,...}); non-object → TypeError; abrupt propagates.
function f(a,b){ return a + "/" + b + "/" + this.x; }
if (Reflect.apply(f, {x:9}, [1,2]) !== "1/2/9") throw "array";
if (Reflect.apply(f, {x:9}, {length:2, 0:"a", 1:"b"}) !== "a/b/9") throw "array-like";
if (Reflect.apply(f, {x:9}, {length:1}) !== "undefined/undefined/9") throw "sparse length";
function C(a,b){ this.s = a + "," + b; }
if (Reflect.construct(C, {length:2, 0:"p", 1:"q"}).s !== "p,q") throw "construct array-like";
[5, "s", null, undefined, true].forEach(function(bad){
  var t=false; try { Reflect.apply(f, null, bad); } catch(e){ t = e instanceof TypeError; }
  if (!t) throw "non-object argumentsList must throw: " + String(bad);
});
var re=false; try { Reflect.apply(f, null, { get length(){ throw new RangeError("L"); } }); } catch(e){ re = e instanceof RangeError; }
if (!re) throw "abrupt length must propagate";
print("ok");

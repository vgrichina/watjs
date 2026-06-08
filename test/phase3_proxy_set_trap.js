// Reflect.set on a Proxy dispatches the 'set' trap and returns ToBoolean(result);
// a falsy trap result → false; no trap → [[Set]] forwarded to the target.
var t1 = {};
if (Reflect.set(new Proxy(t1, { set: function(){ return false; } }), "a", 1) !== false) throw "falsy trap → false";
[null, 0, "", undefined, NaN].forEach(function(fv,i){
  var p = new Proxy({}, { set: function(){ return fv; } });
  if (Reflect.set(p, "k", 1) !== false) throw "falsy trap value " + i;
});
var t2 = {};
var p2 = new Proxy(t2, { set: function(tg,k,v){ tg[k]=v; return true; } });
if (Reflect.set(p2, "b", 9) !== true) throw "truthy trap → true";
if (t2.b !== 9) throw "trap wrote target";
// trap args are (target, key, value, receiver)
var seen;
var p3 = new Proxy(t2, { set: function(tg,k,v,r){ seen = [tg===t2, k, v]; return true; } });
Reflect.set(p3, "x", 7);
if (!seen[0] || seen[1] !== "x" || seen[2] !== 7) throw "trap args: " + seen;
// no trap → forwards to target
var t4 = {};
if (Reflect.set(new Proxy(t4, {}), "c", 5) !== true || t4.c !== 5) throw "no trap forwards to target";
print("ok");

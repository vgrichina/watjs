// Proxy getPrototypeOf trap invariants: result must be Object or null; if the target
// is non-extensible the result must be the target's actual [[Prototype]].
[5, "s", true, undefined, 0].forEach(function(bad){
  var p = new Proxy({}, { getPrototypeOf: function(){ return bad; } });
  var t=false; try { Object.getPrototypeOf(p); } catch(e){ t = e instanceof TypeError; }
  if (!t) throw "non-object/null result must throw: " + typeof bad;
});
var P = {};
if (Object.getPrototypeOf(new Proxy({}, { getPrototypeOf: function(){ return P; } })) !== P) throw "object result";
if (Object.getPrototypeOf(new Proxy({}, { getPrototypeOf: function(){ return null; } })) !== null) throw "null result";
// non-extensible target: trap must return the real prototype
var tgt = Object.preventExtensions(Object.create(Array.prototype));
if (Object.getPrototypeOf(new Proxy(tgt, { getPrototypeOf: function(){ return Array.prototype; } })) !== Array.prototype) throw "non-ext consistent ok";
var bad = false; try { Object.getPrototypeOf(new Proxy(tgt, { getPrototypeOf: function(){ return {}; } })); } catch(e){ bad = e instanceof TypeError; }
if (!bad) throw "non-ext inconsistent must throw";
print("ok");

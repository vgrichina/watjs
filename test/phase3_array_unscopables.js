var u = Array.prototype[Symbol.unscopables];
if (typeof u !== 'object') throw "missing";
if (Object.getPrototypeOf(u) !== null) throw "proto must be null";
['copyWithin','entries','fill','find','findIndex','flat','flatMap','includes','keys','values'].forEach(function(k){
  if (u[k] !== true) throw k+" must be true";
  var d = Object.getOwnPropertyDescriptor(u, k);
  if (d.writable !== true || d.enumerable !== true || d.configurable !== true) throw k+" attrs";
});
// the property on Array.prototype itself: {W:false,E:false,C:true}
var pd = Object.getOwnPropertyDescriptor(Array.prototype, Symbol.unscopables);
if (pd.writable !== false || pd.enumerable !== false || pd.configurable !== true) throw "prop attrs";
print("ok");

var u = Array.prototype[Symbol.unscopables];
if (typeof u !== 'object') throw "missing";
if (Object.getPrototypeOf(u) !== null) throw "proto must be null";
var expected = ['at','copyWithin','entries','fill','find','findIndex','findLast','findLastIndex','flat','flatMap','includes','keys','toReversed','toSorted','toSpliced','values'];
expected.forEach(function(k){
  if (u[k] !== true) throw k+" must be true";
  var d = Object.getOwnPropertyDescriptor(u, k);
  if (d.writable !== true || d.enumerable !== true || d.configurable !== true) throw k+" attrs";
});
// `with` is intentionally NOT in the list (ES2023 change-array-by-copy)
if (Object.prototype.hasOwnProperty.call(u, 'with')) throw "must not have 'with'";
// the property on Array.prototype itself: {W:false,E:false,C:true}
var pd = Object.getOwnPropertyDescriptor(Array.prototype, Symbol.unscopables);
if (pd.writable !== false || pd.enumerable !== false || pd.configurable !== true) throw "prop attrs";
print("ok");

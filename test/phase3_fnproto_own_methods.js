// call/apply/bind/toString are own properties of Function.prototype (in/descriptor/keys),
// while still resolving and remaining overridable on individual functions.
["call","apply","bind","toString"].forEach(function(m){
  if (!(m in Function.prototype)) throw m+" should be in Function.prototype";
  var d = Object.getOwnPropertyDescriptor(Function.prototype, m);
  if (!d || typeof d.value !== "function") throw m+" own descriptor";
  if (d.enumerable !== false) throw m+" must be non-enumerable";
});
// still functional
function f(a,b){ return this.x+a+b; }
if (f.call({x:1},2,3) !== 6) throw "call";
if (f.apply({x:1},[2,3]) !== 6) throw "apply";
if (f.bind({x:10},5)(6) !== 21) throw "bind";
print("ok");

// Function.prototype.toString: TypeError on a non-callable receiver; a callable
// returns a "function NAME() { [native code] }" form (real source text is not
// retained — that's future work); an own toString still overrides.
["{}", "null", "undefined", "42", "'s'"].forEach(function(_,i){
  var vals = [{}, null, undefined, 42, "s"];
  var t=false; try { Function.prototype.toString.call(vals[i]); } catch(e){ t = e instanceof TypeError; }
  if (!t) throw "non-callable receiver must throw: "+i;
});
function foo(){}
var s = foo.toString();
if (typeof s !== "string" || s.indexOf("function") !== 0) throw "callable returns a function string: "+s;
// an own toString overrides the inherited one
function g(){} g.toString = function(){ return "custom"; };
if (g.toString() !== "custom") throw "own toString must win";
// works on a built-in (callable)
if (typeof parseInt.toString() !== "string") throw "builtin toString";
print("ok");

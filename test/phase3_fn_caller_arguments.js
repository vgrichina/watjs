// Function.prototype 'caller' and 'arguments' are %ThrowTypeError% accessors:
// reading them on a function throws a TypeError.
function f(){}
var b = f.bind({});
["caller","arguments"].forEach(function(p){
  var t1=false; try { f[p]; } catch(e){ t1 = e instanceof TypeError; }
  if (!t1) throw "f."+p+" must throw";
  var t2=false; try { b[p]; } catch(e){ t2 = e instanceof TypeError; }
  if (!t2) throw "bound."+p+" must throw";
});
// a strict function called via a getter — bar.caller inside foo throws (the classic A1 case)
function foo(){ return bar.caller; }
var bar = foo.bind({});
function baz(){ return bar(); }
var threw=false; try { baz(); } catch(e){ threw = e instanceof TypeError; }
if (!threw) throw "bar.caller must throw";
// the local `arguments` object inside a function is unaffected
function usesArgs(){ return arguments.length; }
if (usesArgs(1,2,3) !== 3) throw "local arguments object must still work";
print("ok");

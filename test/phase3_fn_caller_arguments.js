// Function.prototype 'caller'/'arguments' are %ThrowTypeError% accessors, BUT an ordinary non-strict
// function has its own null-valued 'caller'/'arguments' that shadow them (legacy web reality:
// f.caller/f.arguments read as null, no throw). Strict/arrow/generator/async/class/method/bound
// functions have no such shadow → they inherit the poison pill and throw.
function f(){}
var b = f.bind({});
["caller","arguments"].forEach(function(p){
  if (f[p] !== null) throw "non-strict f."+p+" must read as null";
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

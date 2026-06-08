// Function .name and .length are non-writable, non-enumerable, configurable.
function foo(a, b){}
var g = function(){};
var arrow = () => {};

function checkNW(fn, key, expected){
  var d = Object.getOwnPropertyDescriptor(fn, key);
  if (d.writable !== false) throw key+" descriptor must be non-writable";
  if (d.enumerable !== false) throw key+" must be non-enumerable";
  if (d.configurable !== true) throw key+" must be configurable";
  if (d.value !== expected) throw key+" value "+d.value+" != "+expected;
  // sloppy assignment must be silently ignored (non-writable)
  fn[key] = "HACKED";
  if (fn[key] !== expected) throw key+" must remain "+expected+" after assignment (got "+fn[key]+")";
}
checkNW(foo, 'name', 'foo');
checkNW(foo, 'length', 2);
checkNW(g, 'name', 'g');
checkNW(arrow, 'length', 0);

// but defineProperty can still redefine (configurable:true), making it writable
Object.defineProperty(foo, 'name', {value: 'renamed', writable: true});
foo.name = 'now-writable';
if (foo.name !== 'now-writable') throw "after defineProperty writable, assignment should work";

// strict mode: assignment to non-writable name throws
function strictTest(){ 'use strict'; var h = function(){}; h.name = "x"; }
var threw = false;
try { strictTest(); } catch(e){ threw = e instanceof TypeError; }
if (!threw) throw "strict assignment to fn.name must throw";
print("ok");

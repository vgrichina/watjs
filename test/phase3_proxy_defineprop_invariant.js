// Proxy defineProperty trap returning true is constrained by the target.
function te(fn){ try { fn(); return false; } catch(e){ return e instanceof TypeError; } }
var ok = function(){ return true; };

// targetDesc undefined + non-extensible target
var t1 = {}; Object.preventExtensions(t1);
if (!te(function(){ Object.defineProperty(new Proxy(t1, {defineProperty: ok}), "foo", {}); }))
  throw "add to non-extensible must throw";
// targetDesc undefined + descriptor configurable:false
if (!te(function(){ Object.defineProperty(new Proxy({}, {defineProperty: ok}), "foo", {configurable:false}); }))
  throw "absent + non-configurable desc must throw";
// targetDesc configurable, desc non-configurable
var t3 = {}; Object.defineProperty(t3, "foo", {value:1, configurable:true});
if (!te(function(){ Object.defineProperty(new Proxy(t3, {defineProperty: ok}), "foo", {value:1, configurable:false}); }))
  throw "configurable->non-configurable must throw";
// non-configurable non-writable data, change value
var t4 = {}; Object.defineProperty(t4, "foo", {value:1});
if (!te(function(){ Object.defineProperty(new Proxy(t4, {defineProperty: ok}), "foo", {value:2}); }))
  throw "value change of non-writable must throw";
// non-configurable writable data, set writable:false (proxy 16c)
var t5 = {}; Object.defineProperty(t5, "foo", {value:1, writable:true, configurable:false});
if (!te(function(){ Object.defineProperty(new Proxy(t5, {defineProperty: ok}), "foo", {writable:false}); }))
  throw "writable->non-writable on non-configurable must throw";

// legitimate: configurable target, compatible redefine succeeds
var t6 = {foo:1};
var p6 = new Proxy(t6, {defineProperty: function(t,k,d){ Object.defineProperty(t,k,d); return true; }});
Object.defineProperty(p6, "foo", {value:2});
if (t6.foo !== 2) throw "compatible redefine should work";
// Reflect.defineProperty: trap returns false → returns false (no throw)
if (Reflect.defineProperty(new Proxy({}, {defineProperty: function(){ return false; }}), "x", {value:1}) !== false)
  throw "reflect false trap returns false";
print("ok");

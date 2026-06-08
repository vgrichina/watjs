function te(fn){ try { fn(); return false; } catch(e){ return e instanceof TypeError; } }
// step 5: trap result must be object or undefined
if (!te(function(){ Object.getOwnPropertyDescriptor(new Proxy({}, {getOwnPropertyDescriptor: function(){ return 42; }}), "x"); }))
  throw "non-object trap result must throw";
// step 7b: undefined result but target has non-configurable prop
var t1 = {}; Object.defineProperty(t1, "x", {value:1, configurable:false});
if (!te(function(){ Object.getOwnPropertyDescriptor(new Proxy(t1, {getOwnPropertyDescriptor: function(){ return undefined; }}), "x"); }))
  throw "undefined result for non-configurable target prop must throw";
// step 7d: undefined result, prop exists, target non-extensible
var t2 = {x:1}; Object.preventExtensions(t2);
if (!te(function(){ Object.getOwnPropertyDescriptor(new Proxy(t2, {getOwnPropertyDescriptor: function(){ return undefined; }}), "x"); }))
  throw "undefined result for existing prop on non-extensible must throw";
// step 9: invalid descriptor (value + get)
if (!te(function(){ Object.getOwnPropertyDescriptor(new Proxy({}, {getOwnPropertyDescriptor: function(){ return {value:1, get: function(){}}; }}), "x"); }))
  throw "invalid descriptor must throw";
// step 19a: report non-configurable for absent/configurable target prop
if (!te(function(){ Object.getOwnPropertyDescriptor(new Proxy({}, {getOwnPropertyDescriptor: function(){ return {configurable:false}; }}), "x"); }))
  throw "non-configurable result for absent target prop must throw";
// legitimate: trap returns a valid descriptor, target compatible
var t3 = {}; Object.defineProperty(t3, "x", {value:9, configurable:true, writable:true, enumerable:true});
var d = Object.getOwnPropertyDescriptor(new Proxy(t3, {getOwnPropertyDescriptor: function(t,k){ return Object.getOwnPropertyDescriptor(t,k); }}), "x");
if (d.value !== 9 || d.configurable !== true) throw "valid descriptor should pass through";
// hasOwnProperty dispatches getOwnPropertyDescriptor
if (new Proxy({attr:1}, {}).hasOwnProperty("attr") !== true) throw "hasOwnProperty true";
if (new Proxy({attr:1}, {}).hasOwnProperty("nope") !== false) throw "hasOwnProperty false";
if (Object.hasOwn(new Proxy({attr:1}, {}), "attr") !== true) throw "Object.hasOwn true";
print("ok");

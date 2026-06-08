function te(fn){ try { fn(); return false; } catch(e){ return e instanceof TypeError; } }
// trap returns false → Object.setPrototypeOf throws, Reflect returns false
var p1 = new Proxy({}, {setPrototypeOf: function(){ return false; }});
if (!te(function(){ Object.setPrototypeOf(p1, {}); })) throw "Object.setPrototypeOf must throw on false";
if (Reflect.setPrototypeOf(p1, {}) !== false) throw "Reflect.setPrototypeOf returns false";
// trap returns true, extensible target → success
var proto = {};
var calls = [];
var p2 = new Proxy({}, {setPrototypeOf: function(t,v){ calls.push(v); return true; }});
if (Reflect.setPrototypeOf(p2, proto) !== true) throw "Reflect true";
Object.setPrototypeOf(p2, proto); // no throw
if (calls.length !== 2) throw "trap called twice";
// non-extensible target: proto must equal current
var t3 = {}; Object.preventExtensions(t3);
var p3 = new Proxy(t3, {setPrototypeOf: function(){ return true; }});
if (!te(function(){ Object.setPrototypeOf(p3, {}); })) throw "non-extensible mismatch must throw";
// non-extensible target, same proto (Object.prototype) → ok
var p3b = new Proxy(t3, {setPrototypeOf: function(){ return true; }});
if (Reflect.setPrototypeOf(p3b, Object.prototype) !== true) throw "same proto ok";
// cycle: Reflect returns false, Object throws
var o = {};
if (Reflect.setPrototypeOf(o, o) !== false) throw "Reflect cycle false";
if (!te(function(){ Object.setPrototypeOf(o, o); })) throw "Object cycle throws";
print("ok");

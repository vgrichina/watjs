function te(fn){ try { fn(); return false; } catch(e){ return e instanceof TypeError; } }
// trap returns false → Object.preventExtensions throws, Reflect returns false
var p1 = new Proxy({}, {preventExtensions: function(){ return false; }});
if (!te(function(){ Object.preventExtensions(p1); })) throw "Object.preventExtensions must throw on false";
var p1b = new Proxy({}, {preventExtensions: function(){ return false; }});
if (Reflect.preventExtensions(p1b) !== false) throw "Reflect returns false";
// trap returns true but target still extensible → TypeError (invariant)
var p2 = new Proxy({}, {preventExtensions: function(){ return true; }});
if (!te(function(){ Object.preventExtensions(p2); })) throw "true with extensible target must throw";
// trap returns true and actually prevents target → ok
var p3 = new Proxy({}, {preventExtensions: function(t){ Object.preventExtensions(t); return true; }});
if (Reflect.preventExtensions(p3) !== true) throw "consistent true ok";
// missing trap forwards
var t4 = {};
var p4 = new Proxy(t4, {});
Object.preventExtensions(p4);
if (Object.isExtensible(t4) !== false) throw "forward prevents target";
print("ok");

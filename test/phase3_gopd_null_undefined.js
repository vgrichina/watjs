// Object.getOwnPropertyDescriptor(O, P) does ToObject(O): null/undefined → TypeError.
function te(fn){ try { fn(); return false; } catch(e){ return e instanceof TypeError; } }
if (!te(function(){ Object.getOwnPropertyDescriptor(undefined, "x"); })) throw "undefined";
if (!te(function(){ Object.getOwnPropertyDescriptor(null, "x"); })) throw "null";
// normal objects still work
var d = Object.getOwnPropertyDescriptor({a: 1}, "a");
if (!d || d.value !== 1 || d.writable !== true) throw "normal";
// absent property → undefined (not a throw)
if (Object.getOwnPropertyDescriptor({}, "nope") !== undefined) throw "absent";
print("ok");

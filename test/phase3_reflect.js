// Reflect: target validation + isExtensible/preventExtensions/setPrototypeOf
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ Reflect.get(5, "x"); }));
print(thr(function(){ Reflect.set(5, "x", 1); }));
print(thr(function(){ Reflect.has(5, "x"); }));
print(thr(function(){ Reflect.deleteProperty(5, "x"); }));
print(thr(function(){ Reflect.ownKeys(5); }));
print(thr(function(){ Reflect.getPrototypeOf(5); }));
print(thr(function(){ Reflect.defineProperty(5, "x", {}); }));
print(thr(function(){ Reflect.getOwnPropertyDescriptor(5, "x"); }));
print(thr(function(){ Reflect.apply(5, null, []); }));      // not callable
print(thr(function(){ Reflect.isExtensible(5); }));
print(thr(function(){ Reflect.preventExtensions(5); }));
print(thr(function(){ Reflect.setPrototypeOf(5, null); }));
// happy paths
var o = {a:1};
print(Reflect.get(o, "a"));
print(Reflect.isExtensible(o));
print(Reflect.preventExtensions(o));
print(Reflect.isExtensible(o));
print(Reflect.setPrototypeOf(o, null));
print(Reflect.getPrototypeOf(o));
print(typeof Reflect.isExtensible);
print(Reflect.isExtensible.length);
print(Reflect.setPrototypeOf.length);

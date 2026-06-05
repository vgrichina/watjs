// Constructors that require `new` throw a TypeError when called as functions
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ Map(); }));
print(thr(function(){ Set(); }));
print(thr(function(){ WeakMap(); }));
print(thr(function(){ WeakSet(); }));
print(thr(function(){ Int8Array(4); }));
print(thr(function(){ Float64Array(2); }));
print(thr(function(){ ArrayBuffer(8); }));
print(thr(function(){ DataView(new ArrayBuffer(8)); }));
print(thr(function(){ Promise(function(){}); }));
print(thr(function(){ WeakRef({}); }));
// `new` still works, and these are not affected:
print(new Map([["a",1]]).get("a"));
print(new Set([1,2]).size);
print(new Int8Array(4).length);
print(new ArrayBuffer(8).slice(0,4).byteLength);   // internal ctor call still ok
print(new Set([1,2]).union(new Set([3])).size);
print(new Int8Array([1,2,3]).map(function(x){return x*2;}).join(","));
// these are callable as functions (NOT requires-new)
print(Number(5));
print(String(7));
print(Array(3).length);
print(typeof Date());     // string

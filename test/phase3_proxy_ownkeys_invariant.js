function te(fn){ try { fn(); return false; } catch(e){ return e instanceof TypeError; } }
// trap result must be an object
if (!te(function(){ Object.keys(new Proxy({}, {ownKeys: function(){ return undefined; }})); })) throw "non-object result";
if (!te(function(){ Object.keys(new Proxy({}, {ownKeys: function(){ return 5; }})); })) throw "number result";
// elements must be string/symbol
if (!te(function(){ Object.keys(new Proxy({}, {ownKeys: function(){ return [{}]; }})); })) throw "object element";
if (!te(function(){ Object.keys(new Proxy({}, {ownKeys: function(){ return [1]; }})); })) throw "number element";
// no duplicates
if (!te(function(){ Object.keys(new Proxy({}, {ownKeys: function(){ return ["a","a"]; }})); })) throw "duplicate";
var s = Symbol();
if (!te(function(){ Object.getOwnPropertyNames(new Proxy({}, {ownKeys: function(){ return [s, s]; }})); })) throw "dup symbol";
// non-configurable target key must be present
var t1 = {}; Object.defineProperty(t1, "x", {value:1, configurable:false, enumerable:true});
if (!te(function(){ Object.keys(new Proxy(t1, {ownKeys: function(){ return []; }})); })) throw "missing non-configurable";
// non-extensible: must list exactly target keys
var t2 = {foo:1}; Object.preventExtensions(t2);
if (!te(function(){ Object.keys(new Proxy(t2, {ownKeys: function(){ return ["foo","bar"]; }})); })) throw "extra key on non-extensible";
if (!te(function(){ Object.keys(new Proxy(t2, {ownKeys: function(){ return []; }})); })) throw "missing key on non-extensible";
// legitimate: forwarding & matching keys
var t3 = {a:1, b:2};
var keys = Object.getOwnPropertyNames(new Proxy(t3, {ownKeys: function(t){ return Object.getOwnPropertyNames(t); }}));
keys.sort();
if (keys.join(",") !== "a,b") throw "valid ownKeys should pass: "+keys;
print("ok");

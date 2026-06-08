// A present-but-non-callable proxy trap is a TypeError (GetMethod), not a silent
// fall-through to the target. (Covers traps dispatched via proxy_trap.)
function thr(op){ var t=false; try{ op(); }catch(e){ t = e instanceof TypeError; } return t; }
if (!thr(function(){ new (new Proxy(function(){}, { construct: 5 }))(); })) throw "construct trap not callable";
if (!thr(function(){ Object.getPrototypeOf(new Proxy({}, { getPrototypeOf: 7 })); })) throw "getPrototypeOf";
if (!thr(function(){ Object.isExtensible(new Proxy({}, { isExtensible: "s" })); })) throw "isExtensible";
if (!thr(function(){ Reflect.ownKeys(new Proxy({}, { ownKeys: {} })); })) throw "ownKeys";
if (!thr(function(){ Object.preventExtensions(new Proxy({}, { preventExtensions: 1 })); })) throw "preventExtensions";
// a callable trap or an absent trap still works
var p = new Proxy({a:1}, { getPrototypeOf: function(){ return Array.prototype; } });
if (Object.getPrototypeOf(p) !== Array.prototype) throw "callable trap works";
if (Object.getPrototypeOf(new Proxy({}, {})) !== Object.prototype) throw "absent trap forwards";
print("ok");

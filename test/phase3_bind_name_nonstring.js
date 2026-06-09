// Function.prototype.bind: if the target's .name is not a String, the bound
// name is "bound " (empty suffix) per spec (no ToString coercion).
function nm(t){ return Object.defineProperty(function(){}, 'name', {value: t, configurable: true}); }
if (nm(undefined).bind().name !== "bound ") throw "undefined name";
if (nm(null).bind().name !== "bound ") throw "null name";
if (nm(Symbol('x')).bind().name !== "bound ") throw "symbol name";
if (nm(42).bind().name !== "bound ") throw "number name";
// a real string name is used
function named(){}
if (named.bind().name !== "bound named") throw "string name";
// anonymous (empty name)
if ((function(){}).bind().name !== "bound ") throw "anon name";
// attributes: {W:false, E:false, C:true}
var d = Object.getOwnPropertyDescriptor(named.bind(), 'name');
if (d.writable !== false || d.enumerable !== false || d.configurable !== true) throw "attrs";
print("ok");

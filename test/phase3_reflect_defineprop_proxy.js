// Reflect.defineProperty on a Proxy dispatches the defineProperty trap and returns
// ToBoolean(result); no trap forwards to the target.
var log;
var p = new Proxy({}, { defineProperty: function(t,k,d){ log = [k, d.value]; return true; } });
if (Reflect.defineProperty(p, "x", { value: 5 }) !== true) throw "truthy trap → true";
if (log[0] !== "x" || log[1] !== 5) throw "trap args (key, descriptor)";
var p2 = new Proxy({}, { defineProperty: function(){ return false; } });
if (Reflect.defineProperty(p2, "y", { value: 1 }) !== false) throw "falsy trap → false";
var t3 = {};
if (Reflect.defineProperty(new Proxy(t3, {}), "z", { value: 9 }) !== true) throw "no trap forwards";
if (t3.z !== 9) throw "no-trap defined on target";
print("ok");

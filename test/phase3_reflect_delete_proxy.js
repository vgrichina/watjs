// Reflect.deleteProperty on a Proxy dispatches the deleteProperty trap and returns
// ToBoolean(result); no trap forwards [[Delete]] to the target.
var log = [];
var p = new Proxy({a:1}, { deleteProperty: function(t,k){ log.push(k); return false; } });
if (Reflect.deleteProperty(p, "a") !== false) throw "falsy trap → false";
if (log.join(",") !== "a") throw "trap called with key";
var t2 = {b:2};
var p2 = new Proxy(t2, { deleteProperty: function(t,k){ delete t[k]; return true; } });
if (Reflect.deleteProperty(p2, "b") !== true) throw "truthy trap → true";
if (t2.hasOwnProperty("b")) throw "trap deleted target prop";
// no trap → forward to target
var t3 = {c:3};
if (Reflect.deleteProperty(new Proxy(t3, {}), "c") !== true) throw "no trap forwards";
if (t3.hasOwnProperty("c")) throw "no-trap deleted on target";
print("ok");

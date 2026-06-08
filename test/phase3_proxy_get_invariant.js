// Proxy "get" trap result must be consistent with a non-configurable own
// property of the target.
var t1 = {};
Object.defineProperty(t1, "x", { value: 42, writable: false, configurable: false });
var p1 = new Proxy(t1, { get: function(){ return 99; } });
var a=false; try { p1.x; } catch(e){ a = e instanceof TypeError; }
if (!a) throw "mismatch on non-writable non-configurable data must throw";
// SameValue match is fine
var p1b = new Proxy(t1, { get: function(){ return 42; } });
if (p1b.x !== 42) throw "matching value ok";

var t2 = {};
Object.defineProperty(t2, "y", { get: undefined, set: undefined, configurable: false });
var p2 = new Proxy(t2, { get: function(){ return 1; } });
var b=false; try { p2.y; } catch(e){ b = e instanceof TypeError; }
if (!b) throw "non-undefined on getterless non-configurable accessor must throw";
var p2b = new Proxy(t2, { get: function(){ return undefined; } });
if (p2b.y !== undefined) throw "undefined ok";

// configurable data: any value allowed
var p3 = new Proxy({ z: 1 }, { get: function(){ return 7; } });
if (p3.z !== 7) throw "configurable allows any value";
print("ok");

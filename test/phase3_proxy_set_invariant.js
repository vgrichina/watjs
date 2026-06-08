// Proxy "set" trap returning true cannot violate a non-configurable own property.
var t1 = {};
Object.defineProperty(t1, "attr", { configurable: false, writable: false, value: "foo" });
var p1 = new Proxy(t1, { set: function(){ return true; } });
var a=false; try { p1.attr = "bar"; } catch(e){ a = e instanceof TypeError; }
if (!a) throw "writing non-writable non-configurable data must throw";
// SameValue write is allowed
var p1b = new Proxy(t1, { set: function(){ return true; } });
p1b.attr = "foo";  // value equals current → no throw

var t2 = {};
Object.defineProperty(t2, "attr", { configurable: false, set: undefined });
var p2 = new Proxy(t2, { set: function(){ return true; } });
var b=false; try { p2.attr = "bar"; } catch(e){ b = e instanceof TypeError; }
if (!b) throw "writing setterless non-configurable accessor must throw";

// trap returning a truthy value works for a normal property
var log = [];
var p3 = new Proxy({}, { set: function(t,k,v){ log.push(k+"="+v); return true; } });
p3.x = 5;
if (log.join(",") !== "x=5") throw "normal set forwards to trap";
print("ok");

// Proxy "has" trap: a false result cannot hide a non-configurable own property
// of the target, nor any own property when the target is non-extensible.
var t1 = {};
Object.defineProperty(t1, "attr", { configurable: false, value: 1 });
var p1 = new Proxy(t1, { has: function(){ return false; } });
var a=false; try { ("attr" in p1); } catch(e){ a = e instanceof TypeError; }
if (!a) throw "non-configurable own prop reported absent must throw";

var t2 = {};
Object.defineProperty(t2, "attr", { configurable: true, value: 1 });
Object.preventExtensions(t2);
var p2 = new Proxy(t2, { has: function(){ return false; } });
var b=false; try { ("attr" in p2); } catch(e){ b = e instanceof TypeError; }
if (!b) throw "own prop on non-extensible target reported absent must throw";

// legitimate false: configurable own prop on extensible target
var p3 = new Proxy({ attr: 1 }, { has: function(){ return false; } });
if (("attr" in p3) !== false) throw "configurable own on extensible may report absent";
// true result forwarded
var p4 = new Proxy({}, { has: function(){ return true; } });
if (("anything" in p4) !== true) throw "true result";
// missing trap forwards to target
if (("x" in new Proxy({ x: 1 }, {})) !== true) throw "absent trap forwards";
print("ok");

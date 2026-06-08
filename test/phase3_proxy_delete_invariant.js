// Proxy deleteProperty trap returning true cannot report a non-configurable
// own property (or any property of a non-extensible target) as deleted.
var t1 = {};
Object.defineProperty(t1, "attr", { configurable: false, value: 1 });
var p1 = new Proxy(t1, { deleteProperty: function(){ return true; } });
var a=false; try { delete p1.attr; } catch(e){ a = e instanceof TypeError; }
if (!a) throw "delete operator: non-configurable must throw";
var a2=false; try { Reflect.deleteProperty(p1, "attr"); } catch(e){ a2 = e instanceof TypeError; }
if (!a2) throw "Reflect.deleteProperty: non-configurable must throw";

var t2 = {};
Object.defineProperty(t2, "attr", { configurable: true, value: 1 });
Object.preventExtensions(t2);
var p2 = new Proxy(t2, { deleteProperty: function(){ return true; } });
var b=false; try { delete p2.attr; } catch(e){ b = e instanceof TypeError; }
if (!b) throw "delete on non-extensible target with existing prop must throw";

// legitimate delete of a configurable prop on an extensible target
var t3 = { x: 1 };
var p3 = new Proxy(t3, { deleteProperty: function(t,k){ delete t[k]; return true; } });
if ((delete p3.x) !== true) throw "configurable delete returns true";
// trap returning false → delete yields false
var p4 = new Proxy({ y: 1 }, { deleteProperty: function(){ return false; } });
if ((delete p4.y) !== false) throw "false trap → false";
print("ok");

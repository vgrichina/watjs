// Set/Map methods throw TypeError on an incompatible receiver
function thr(fn){ try { fn(); return false; } catch(e){ return e instanceof TypeError; } }
print(thr(function(){ Set.prototype.add.call(0, 1); }));
print(thr(function(){ Set.prototype.add.call({}, 1); }));
print(thr(function(){ Set.prototype.has.call(undefined, 1); }));
print(thr(function(){ Map.prototype.get.call(0, 1); }));
print(thr(function(){ Map.prototype.set.call({}, 1, 2); }));
print(thr(function(){ Map.prototype.has.call(null, 1); }));
// but a real instance still works
var s = new Set(); s.add(5); print(s.has(5));
var m = new Map(); m.set("k", 9); print(m.get("k"));

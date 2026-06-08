// Set.prototype.entries() yields [value, value] pairs (was missing entirely).
var s = new Set(["a", "b", "c"]);
if (typeof s.entries !== "function") throw "entries missing";
var e = [...s.entries()];
if (JSON.stringify(e) !== '[["a","a"],["b","b"],["c","c"]]') throw "pairs: "+JSON.stringify(e);
var it = s.entries();
var r = it.next();
if (r.done !== false || r.value[0] !== "a" || r.value[1] !== "a") throw "first";
if ([...new Set().entries()].length !== 0) throw "empty";
// entries on a non-Set throws
var t = false; try { Set.prototype.entries.call({}); } catch(e2){ t = e2 instanceof TypeError; }
if (!t) throw "brand check";
print("ok");

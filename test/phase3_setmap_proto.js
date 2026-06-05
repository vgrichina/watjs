// Set/Map methods live on the prototype, not per-instance
var s = new Set([1,2,3]);
print(typeof Set.prototype.add);
print(typeof Set.prototype.has);
print(typeof Map.prototype.get);
print(typeof Map.prototype.set);
print(s.has(2));
s.add(4); print(s.size);
print(s.hasOwnProperty("add"));
print(Object.getPrototypeOf(s) === Set.prototype);
print(Set.prototype.constructor === Set);
var m = new Map([["a",1]]);
print(m.get("a"));
m.set("b",2); print(m.size);
print(m.hasOwnProperty("get"));
print(Object.getPrototypeOf(m) === Map.prototype);
print(Map.prototype.constructor === Map);

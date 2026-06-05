// Proxy traps: has / deleteProperty / getPrototypeOf / setPrototypeOf / isExtensible / preventExtensions
var log = [];
var base = {p:1};
var t = Object.create(base); t.x = 1; t.y = 2;
var p = new Proxy(t, {
  has(tg,k){ log.push("has:"+k); return k in tg; },
  deleteProperty(tg,k){ log.push("del:"+k); delete tg[k]; return true; },
  getPrototypeOf(tg){ log.push("gpo"); return Object.getPrototypeOf(tg); },
  setPrototypeOf(tg,proto){ log.push("spo"); return true; },
  isExtensible(tg){ log.push("isExt"); return Reflect.isExtensible(tg); },
  preventExtensions(tg){ log.push("prevExt"); Object.preventExtensions(tg); return true; }
});
print("x" in p);
print("p" in p);          // inherited via has→in
print(delete p.x);
print("x" in t);
print(Object.getPrototypeOf(p) === base);
print(Object.setPrototypeOf(p, null) === p);
print(Object.isExtensible(p));
Object.preventExtensions(p);
print(Object.isExtensible(t));
print(log.join("|"));
// forwarding (no traps)
var t2 = {a:1}; var p2 = new Proxy(t2, {});
print("a" in p2);
print(delete p2.a, "a" in t2);
// ownKeys / getOwnPropertyDescriptor / defineProperty traps
var t3={a:1,b:2};
var p3 = new Proxy(t3, {
  ownKeys(tg){ return ["x","y"]; },
  getOwnPropertyDescriptor(tg,k){ return {value:42,enumerable:true,configurable:true,writable:true}; },
  defineProperty(tg,k,d){ log.push("defP:"+k); return true; }
});
print(Object.getOwnPropertyNames(p3).join(","));
print(Object.getOwnPropertyDescriptor(p3,"q").value);
Object.defineProperty(p3, "z", {value:1});
print(Object.getOwnPropertyNames(new Proxy({m:1,n:2},{})).join(","));

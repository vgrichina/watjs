// Reflect.set(target, key, value, receiver): OrdinarySetWithOwnDescriptor.
// A writable data prop (or none) is written on the RECEIVER, not the target; an
// accessor fires its setter with this=receiver; failures return false.
var t = {p: 42}, r = {};
if (Reflect.set(t, "p", 43, r) !== true) throw "data+receiver returns true";
if (t.p !== 42) throw "target must be unchanged";
if (r.p !== 43) throw "value set on receiver";
var t2 = {}, r2 = {};
if (Reflect.set(t2, "x", 1, r2) !== true) throw "create on receiver";
if (t2.hasOwnProperty("x")) throw "target gets no new prop";
if (r2.x !== 1) throw "receiver gets the new prop";
var seen; var t3 = { set p(v){ seen = this; } }, r3 = {};
Reflect.set(t3, "p", 9, r3);
if (seen !== r3) throw "setter this must be the receiver";
var t4 = {}; Object.defineProperty(t4, "p", { value: 1, writable: false });
if (Reflect.set(t4, "p", 2, {}) !== false) throw "non-writable target → false";
if (Reflect.set({p:1}, "p", 2, 5) !== false) throw "non-object receiver → false";
// 3-arg form (receiver defaults to target) still writes the target
var t5 = {}; if (Reflect.set(t5, "a", 7) !== true || t5.a !== 7) throw "3-arg form";
print("ok");

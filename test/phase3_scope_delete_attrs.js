// Deleting a property must not corrupt the attributes of entries that shift
// down to fill its slot (scope_delete moves name+value+KIND together).
function p(n, v) { print(n + "=" + v); }

var o = {};
Object.defineProperty(o, "a", { value: 1, writable: true, enumerable: true, configurable: true });
Object.defineProperty(o, "b", { value: 2, writable: false, enumerable: false, configurable: false });
delete o.a;                       // "b" shifts into a's old slot
var d = Object.getOwnPropertyDescriptor(o, "b");
p("b-attrs", d.writable + "," + d.enumerable + "," + d.configurable); // false,false,false
o.b = 99; p("b-readonly", o.b);   // 2 (still non-writable)

// non-writable length on an array-like object: pop/shift/unshift/push throw
function thr(n, fn) { try { fn(); print(n + "=NOTHROW"); } catch (e) { print(n + "=" + e.constructor.name); } }
function mk() { var x = { 0: "a", length: 1 }; Object.defineProperty(x, "length", { writable: false }); return x; }
thr("pop", function () { Array.prototype.pop.call(mk()); });
thr("shift", function () { Array.prototype.shift.call(mk()); });
thr("unshift", function () { Array.prototype.unshift.call(mk(), "z"); });
thr("push", function () { Array.prototype.push.call(mk(), "z"); });

// 2^53-1 limit on array-like push
thr("push-limit", function () { Array.prototype.push.call({ length: 9007199254740991 }, 1); });

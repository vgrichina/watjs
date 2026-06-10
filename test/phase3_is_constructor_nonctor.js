// IsConstructor must be false for arrows, concise methods, getters/setters, generators,
// async functions, and bound-non-constructors; `new` on them throws TypeError.
// (Was: every VM function was treated as a constructor.)
function isC(f) { try { Reflect.construct(function(){}, [], f); } catch (e) { return false; } return true; }

// non-constructors
if (isC(() => {})) throw new Error("arrow is not a constructor");
if (isC(async () => {})) throw new Error("async arrow");
if (isC({ m() {} }.m)) throw new Error("concise method");
if (isC(Object.getOwnPropertyDescriptor({ get x() {} }, 'x').get)) throw new Error("getter");
if (isC(function* () {})) throw new Error("generator");
if (isC(async function () {})) throw new Error("async function");
if (isC((() => {}).bind(null))) throw new Error("bound arrow");

// constructors
if (!isC(function () {})) throw new Error("plain function IS a constructor");
if (!isC(class {})) throw new Error("class IS a constructor");
if (!isC(function () {}.bind(null))) throw new Error("bound plain IS a constructor");

// `new` on a non-constructor throws TypeError
function mustThrow(fn, label) {
  var threw = false;
  try { fn(); } catch (e) { threw = (e instanceof TypeError); }
  if (!threw) throw new Error("expected TypeError: " + label);
}
mustThrow(() => { new (() => {})(); }, "new arrow");
mustThrow(() => { var o = { m() {} }; new o.m(); }, "new method");

// `new` on a real constructor still works
var inst = new (class { constructor() { this.ok = 1; } })();
if (inst.ok !== 1) throw new Error("new class broke");
var made = new (function () { this.v = 7; })();
if (made.v !== 7) throw new Error("new plain fn broke");

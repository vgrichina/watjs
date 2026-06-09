// instanceof with a generator/async function on the RHS must not crash (fn_get_prototype
// previously read @12 — the code buffer for VM fns — as a scope → OOB).
function* g() {}
async function a() {}
assert(({}) instanceof g === false, "object instanceof generator");
assert(({}) instanceof a === false, "object instanceof async");
assert((function () {}) instanceof g === false, "function instanceof generator");
assert(g instanceof g === false, "generator instanceof itself");
g() instanceof g;  // generator instance instanceof its function — must not crash

// normal-function instanceof still works
function F() {}
var o = new F();
assert(o instanceof F === true, "normal instanceof true");
assert(({}) instanceof F === false, "normal instanceof false");

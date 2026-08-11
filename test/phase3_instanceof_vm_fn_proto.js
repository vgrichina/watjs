// instanceof with a generator/async function on the RHS must not crash (fn_get_prototype
// previously read @12 — the code buffer for VM fns — as a scope → OOB).
function* g() {}
async function a() {}
assert(({}) instanceof g === false, "object instanceof generator");
// an async function has NO .prototype (undefined) → OrdinaryHasInstance throws TypeError (spec/V8).
var asyncThrew = false;
try { ({}) instanceof a; } catch (e) { asyncThrew = e instanceof TypeError; }
assert(asyncThrew, "object instanceof async throws TypeError (async fn has no .prototype)");
assert((function () {}) instanceof g === false, "function instanceof generator");
assert(g instanceof g === false, "generator instanceof itself");
g() instanceof g;  // generator instance instanceof its function — must not crash

// normal-function instanceof still works
function F() {}
var o = new F();
assert(o instanceof F === true, "normal instanceof true");
assert(({}) instanceof F === false, "normal instanceof false");

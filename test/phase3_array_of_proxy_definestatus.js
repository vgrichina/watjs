// Array.of/from with a custom constructor use CreateDataPropertyOrThrow → [[DefineOwnProperty]],
// which for a Proxy target invokes the defineProperty trap and propagates its throw.
var trapCalls = 0;
function CtorReturningProxy() {
  return new Proxy({}, {
    defineProperty: function () { trapCalls++; throw new Error("DP-trap"); },
  });
}
var threw = false;
try { Array.of.call(CtorReturningProxy, "Bob"); } catch (e) { threw = e.message === "DP-trap"; }
if (!threw) throw new Error("Array.of must propagate the defineProperty trap throw");
if (trapCalls !== 1) throw new Error("trap should fire once, got " + trapCalls);

// non-configurable existing own property → CreateDataPropertyOrThrow throws TypeError
function CtorNonConfig() { Object.defineProperty(this, "0", { value: 1, configurable: false }); }
var t2 = false;
try { Array.of.call(CtorNonConfig, "x"); } catch (e) { t2 = e instanceof TypeError; }
if (!t2) throw new Error("redefine non-configurable must throw TypeError");

print("ok");

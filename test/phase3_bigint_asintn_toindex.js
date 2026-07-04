// BigInt.asIntN/asUintN take ToIndex(bits): a BigInt (or BigInt-wrapper object, whose ToPrimitive
// yields a BigInt) => ToNumber(BigInt) => TypeError; negative/too-large => RangeError.
function throws(ctor, f) {
  try { f(); } catch (e) { if (e instanceof ctor) return; throw new Error("wrong error: " + e); }
  throw new Error("expected " + ctor.name);
}
throws(TypeError, function () { BigInt.asIntN(0n, 0n); });
throws(TypeError, function () { BigInt.asIntN(Object(0n), 0n); });
throws(TypeError, function () { BigInt.asUintN(Object(3n), 0n); });
throws(RangeError, function () { BigInt.asIntN(-1, 0n); });
throws(RangeError, function () { BigInt.asIntN(9007199254740992, 0n); });
throws(RangeError, function () { BigInt.asIntN(Infinity, 0n); });
// valid: Object(3) unboxes to 3, bits=3
if (BigInt.asIntN(Object(3), 5n) !== -3n) throw new Error("asIntN(3,5n): " + BigInt.asIntN(3, 5n));
if (BigInt.asUintN(3, 5n) !== 5n) throw new Error("asUintN(3,5n)");
print("ok");

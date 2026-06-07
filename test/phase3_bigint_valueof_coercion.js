// BigInt.prototype.valueOf unboxes a BigInt wrapper; and ToNumber-of-format-args
// (toFixed/indexOf position/etc.) rejects an object whose valueOf/@@toPrimitive
// yields a BigInt.
if (typeof Object(1n).valueOf() !== "bigint") throw new Error("wrapper valueOf");
if (Object(5n).valueOf() !== 5n) throw new Error("wrapper value");
if (BigInt.prototype.valueOf.call(10n) !== 10n) throw new Error("primitive valueOf");
var threwWrap = false;
try { "abc".indexOf("a", Object(1n)); } catch (e) { threwWrap = e instanceof TypeError; }
if (!threwWrap) throw new Error("indexOf Object(1n) position should throw");
var threwVal = false;
try { (5).toFixed({ valueOf: function () { return 1n; } }); } catch (e) { threwVal = e instanceof TypeError; }
if (!threwVal) throw new Error("toFixed valueOf->bigint should throw");
// incompatible receiver
var threwBrand = false;
try { BigInt.prototype.valueOf.call({}); } catch (e) { threwBrand = e instanceof TypeError; }
if (!threwBrand) throw new Error("brand check");
print("ok");

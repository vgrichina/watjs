// Symbol.keyFor throws TypeError on a non-symbol; Symbol.for propagates a throwing ToString.
var t1 = false; try { Symbol.keyFor("x"); } catch (e) { t1 = e instanceof TypeError; }
if (!t1) throw new Error("keyFor non-symbol");
var t2 = false;
try { Symbol.for({ toString: function () { throw new TypeError("boom"); } }); } catch (e) { t2 = e instanceof TypeError; }
if (!t2) throw new Error("for throwing toString");
if (Symbol.keyFor(Symbol.for("reg")) !== "reg") throw new Error("registered round-trip");
if (Symbol.keyFor(Symbol("local")) !== undefined) throw new Error("unregistered → undefined");
print("ok");

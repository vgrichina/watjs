// toExponential coerces fractionDigits (ToInteger) BEFORE the NaN/Infinity shortcut.
function thrnamed(C, f) { try { f(); return false; } catch (e) { return e instanceof C; } }
if (!thrnamed(TypeError, function () { NaN.toExponential({ valueOf: function () { throw new TypeError("x"); } }); }))
  throw new Error("NaN receiver must still coerce fractionDigits");
if (!thrnamed(TypeError, function () { NaN.toExponential(Symbol()); })) throw new Error("symbol fractionDigits");
if (!thrnamed(TypeError, function () { Infinity.toExponential({ valueOf: function () { throw new TypeError("y"); } }); }))
  throw new Error("Infinity receiver coerce");
// normal results
if ((123.456).toExponential(2) !== "1.23e+2") throw new Error("normal");
if (NaN.toExponential() !== "NaN") throw new Error("NaN no-arg");
if (Infinity.toExponential() !== "Infinity") throw new Error("Infinity no-arg");
if ((0).toExponential(3) !== "0.000e+0") throw new Error("zero");
print("ok");

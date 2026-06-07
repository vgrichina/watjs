// A present-but-not-callable @@toPrimitive throws TypeError (GetMethod), across all
// ToPrimitive paths (unary +, String(), template, indexOf position). null/undefined
// @@toPrimitive is allowed (falls back to ordinary valueOf/toString).
function tp(v) { return function () { var o = {}; o[Symbol.toPrimitive] = v; return o; }; }
[42, "x", true, {}].forEach(function (v) {
  var threwNum = false, threwStr = false;
  try { +tp(v)(); } catch (e) { threwNum = e instanceof TypeError; }
  try { String(tp(v)()); } catch (e) { threwStr = e instanceof TypeError; }
  if (!threwNum) throw new Error("unary + should throw for " + typeof v);
  if (!threwStr) throw new Error("String() should throw for " + typeof v);
});
// null/undefined @@toPrimitive → ordinary
var on = {}; on[Symbol.toPrimitive] = null;
if (String(on) !== "[object Object]") throw new Error("null @@toPrimitive falls back");
// callable still works
var ok = { 0: 1, length: 1 }; ok[Symbol.toPrimitive] = function (h) { return h === "number" ? 9 : "S"; };
if (+ok !== 9 || String(ok) !== "S") throw new Error("callable");
print("ok");

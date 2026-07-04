// Template substitution `${x}` is ToString (string-hint ToPrimitive), NOT `+` (default hint),
// and unary `+` on a BigInt-wrapper object rejects it like a raw BigInt.

// object with valueOf (primitive) AND toString: string hint must pick toString
var o = {
  valueOf: function () { return 1; },
  toString: function () { return "STR"; },
};
if (`${o}` !== "STR") throw new Error("template must use toString (string hint): " + `${o}`);
if ("" + o !== "1") throw new Error("`+` must use valueOf (default hint): " + ("" + o));
if (String(o) !== "STR") throw new Error("String() must use toString");

// @@toPrimitive is authoritative for templates too
var p = { [Symbol.toPrimitive]: function (hint) { return "hint:" + hint; } };
if (`${p}` !== "hint:string") throw new Error("template hint: " + `${p}`);

// ToString(Symbol) throws in a template
var threw = false;
try { `${Symbol("s")}`; } catch (e) { threw = e instanceof TypeError; }
if (!threw) throw new Error("template of a Symbol must throw TypeError");

// unary + on a BigInt wrapper throws TypeError (ToNumber, not ToNumeric)
var t2 = false;
try { +Object(5n); } catch (e) { t2 = e instanceof TypeError; }
if (!t2) throw new Error("+Object(bigint) must throw TypeError");
var t3 = false;
try { +5n; } catch (e) { t3 = e instanceof TypeError; }
if (!t3) throw new Error("+bigint must throw TypeError");

// unary + still works on ordinary coercions
if (+"12" !== 12 || +[5] !== 5 || +new Number(9) !== 9 || +{ valueOf: function () { return 7; } } !== 7)
  throw new Error("unary + broke on ordinary coercions");

print("ok");

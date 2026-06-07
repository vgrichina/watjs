// Date.prototype[@@toPrimitive]: length 1, non-writable own prop, hint not coerced.
var d = new Date(0);
if (d[Symbol.toPrimitive].length !== 1) throw new Error("length");
var pd = Object.getOwnPropertyDescriptor(Date.prototype, Symbol.toPrimitive);
if (pd.writable !== false || pd.enumerable !== false || pd.configurable !== true) throw new Error("descriptor");
// valid hints
if (d[Symbol.toPrimitive]("number") !== 0) throw new Error("number hint");
if (typeof d[Symbol.toPrimitive]("string") !== "string") throw new Error("string hint");
if (typeof d[Symbol.toPrimitive]("default") !== "string") throw new Error("default hint");
// invalid hints all throw TypeError WITHOUT coercion
[undefined, null, "", "String", "defaultnumber", new String("number"), { toString: function () { return "number"; } }].forEach(function (h) {
  var threw = false;
  try { d[Symbol.toPrimitive](h); } catch (e) { threw = e instanceof TypeError; }
  if (!threw) throw new Error("hint should throw TypeError: " + String(h));
});
print("ok");

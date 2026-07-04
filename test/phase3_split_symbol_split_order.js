// String.prototype.split resolves separator[@@split] on the RAW receiver BEFORE ToString(this),
// and passes the raw receiver (O) — not the coerced string — to the @@split method.
var toStringCalled = false;
var receiver = { toString: function () { toStringCalled = true; throw new Error("should not ToString"); } };
var got;
var sep = { [Symbol.split]: function (O, limit) { got = { O: O, limit: limit }; return ["ok"]; } };
var r = String.prototype.split.call(receiver, sep, 42);
if (toStringCalled) throw new Error("ToString(this) must not run when @@split is present");
if (got.O !== receiver) throw new Error("@@split must receive the raw receiver");
if (got.limit !== 42) throw new Error("@@split limit");
if (r[0] !== "ok") throw new Error("@@split result");

// RegExp separator still delegates to RegExp.prototype[@@split]
if ("a1b2c".split(/\d/).join("|") !== "a|b|c") throw new Error("regex split");

// plain string separator path unaffected
if ("a,b,c".split(",").join("|") !== "a|b|c") throw new Error("string split");
if ("abc".split("").join("-") !== "a-b-c") throw new Error("empty separator");

// null/undefined this → TypeError (RequireObjectCoercible, before @@split lookup)
var t = false;
try { String.prototype.split.call(null, ","); } catch (e) { t = e instanceof TypeError; }
if (!t) throw new Error("null this must throw TypeError");

print("ok");

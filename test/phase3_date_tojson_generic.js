// toJSON is generic: ToObject → ToPrimitive(number) → null only for non-finite numbers
// → Invoke "toISOString". A plain object whose primitive is a string still invokes.
var marker = {};
var r = Date.prototype.toJSON.call({ toISOString: function () { return marker; } });
if (r !== marker) throw new Error("should return toISOString result");
// non-finite number primitive → null
if (Date.prototype.toJSON.call({ valueOf: function () { return Infinity; }, toISOString: function () { throw new Error("nope"); } }) !== null)
  throw new Error("non-finite should be null");
if (new Date(8.64e15 + 1).toJSON() !== null) throw new Error("invalid date toJSON null");
if (new Date(0).toJSON() !== new Date(0).toISOString()) throw new Error("normal date");
print("ok");

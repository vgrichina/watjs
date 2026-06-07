// Date called as a function (not via `new`) ignores ALL arguments and returns a
// string (the current-time toString), never coercing its args.
if (typeof Date() !== "string") throw new Error("Date() must be a string");
if (typeof new Date() !== "object") throw new Error("new Date() must be an object");
// args are ignored and never coerced
var touched = false;
var poison = { valueOf: function () { touched = true; return 0; }, toString: function () { touched = true; return "x"; } };
poison[Symbol.toPrimitive] = function () { touched = true; throw new Error("must not be called"); };
Date(poison);
if (touched) throw new Error("Date(value) must not coerce its argument");
// construct still works
if (new Date(0).getTime() !== 0) throw new Error("new Date(0)");
print("ok");

// new Date(value): non-Date arg → ToPrimitive(default) then String→parse else ToNumber.
// A Date arg uses its time value directly (no ToPrimitive).
var c = 0, tv, alen;
var s = {};
s[Symbol.toPrimitive] = function () { tv = this; alen = arguments.length; c++; return "2020-01-01T00:00Z"; };
var d = new Date(s);
if (c !== 1) throw new Error("toPrimitive call count " + c);
if (tv !== s) throw new Error("this value");
if (alen !== 1) throw new Error("arg count " + alen);
if (d.getUTCFullYear() !== 2020) throw new Error("parsed year " + d.getUTCFullYear());
if (new Date(123).getTime() !== 123) throw new Error("number arg");
if (new Date(new Date(456)).getTime() !== 456) throw new Error("date arg copies time");
// object whose primitive is a number
var n = { valueOf: function () { return 789; } };
if (new Date(n).getTime() !== 789) throw new Error("valueOf number");
print("ok");

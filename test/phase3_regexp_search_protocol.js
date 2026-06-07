// RegExp.prototype[@@search] follows the spec: saves/restores lastIndex, uses
// RegExpExec, returns result.index or -1.
if ("abcXdef".search(/X/) !== 3) throw new Error("basic");
if ("abc".search(/z/) !== -1) throw new Error("no match -1");
// lastIndex saved and restored
var r = /x/; r.lastIndex = 5;
if ("axx".search(r) !== 1) throw new Error("search ignores lastIndex");
if (r.lastIndex !== 5) throw new Error("lastIndex restored, got " + r.lastIndex);
// custom exec is used
var r2 = /./; r2.exec = function () { return { index: 42 }; };
if ("a".search(r2) !== 42) throw new Error("custom exec");
var r3 = /./; r3.exec = function () { return null; };
if ("a".search(r3) !== -1) throw new Error("custom exec null");
print("ok");

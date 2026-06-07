// exec/test length is 1; RegExpBuiltinExec always evaluates ToLength(Get(R,"lastIndex"))
// once (side effect) even for a non-global regex, but doesn't write it back.
if (RegExp.prototype.exec.length !== 1) throw new Error("exec.length");
if (RegExp.prototype.test.length !== 1) throw new Error("test.length");
var gets = 0;
var counter = { valueOf: function () { gets++; return 0; } };
var r = /./; r.lastIndex = counter;
var res = r.exec("abc");
if (res[0] !== "a") throw new Error("match");
if (r.lastIndex !== counter) throw new Error("non-global must not write lastIndex");
if (gets !== 1) throw new Error("lastIndex read exactly once, got " + gets);
// global still advances lastIndex
var g = /x/g; g.exec("axx"); if (g.lastIndex !== 2) throw new Error("global lastIndex");
print("ok");

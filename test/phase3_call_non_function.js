// Calling a non-callable value throws TypeError (was silently returning undefined).
function thr(f) { try { f(); return false; } catch (e) { return e instanceof TypeError; } }
if (!thr(function () { var x; x(); })) throw new Error("undefined()");
if (!thr(function () { (5)(); })) throw new Error("number()");
if (!thr(function () { var o = {}; o.missing(); })) throw new Error("missing method");
if (!thr(function () { "s".notAMethod(); })) throw new Error("string missing method");
if (!thr(function () { var a = [1]; a.nope(); })) throw new Error("array missing method");
if (!thr(function () { null; ({}).x.y; })) { /* unrelated */ }
// normal calls still work
function f() { return 42; }
if (f() !== 42) throw new Error("normal call");
if ([1, 2].map(function (x) { return x + 1; }).join() !== "2,3") throw new Error("callback");
if ("ab".toUpperCase() !== "AB") throw new Error("method");
if (Math.max(1, 2) !== 2) throw new Error("native");
print("ok");

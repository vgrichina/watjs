// Spreading an iterator whose next() throws propagates the error (was an OOB crash).
function fn() { return arguments.length; }
var bad = {}; bad[Symbol.iterator] = function () { return { next: function () { throw new TypeError("boom"); } }; };
var t1 = false; try { fn(...bad); } catch (e) { t1 = e instanceof TypeError; }
if (!t1) throw new Error("call spread should propagate");
var t2 = false; try { [...bad]; } catch (e) { t2 = e instanceof TypeError; }
if (!t2) throw new Error("array spread should propagate");
// a next() result that isn't an object → TypeError
var bad2 = {}; bad2[Symbol.iterator] = function () { return { next: function () { return 5; } }; };
var t3 = false; try { [...bad2]; } catch (e) { t3 = e instanceof TypeError; }
if (!t3) throw new Error("non-object iterator result");
// normal spreads still work
if (fn(...[1, 2, 3]) !== 3) throw new Error("array");
if (fn(..."ab") !== 2) throw new Error("string");
print("ok");

// String.prototype.repeat throws RangeError when the RESULT length (count * strlen) would
// exceed the max string length — not just when the count alone is large.
function throws(f) { try { f(); } catch (e) { if (e instanceof RangeError) return; throw new Error("wrong: " + e); } throw new Error("expected RangeError"); }
throws(function () { "ab".repeat(1e9); });      // 2e9 chars — was a memory-OOB trap (count < 2^30)
throws(function () { "ab".repeat(Infinity); });
throws(function () { "ab".repeat(-1); });
if ("ab".repeat(3) !== "ababab") throw new Error("basic");
if ("".repeat(1e9) !== "") throw new Error("empty string any count");
if ("x".repeat(1000).length !== 1000) throw new Error("moderate");
if ("ab".repeat(0) !== "") throw new Error("zero");
print("ok");

// toReversed/toSorted/with/toSpliced: nullish receiver → TypeError;
// source length > 2^32-1 → RangeError; normal cases unaffected.
function thr(n, fn) { try { fn(); print(n + "=NOTHROW"); } catch (e) { print(n + "=" + e.constructor.name); } }
function p(n, v) { print(n + "=" + v); }

thr("with-null", function () { Array.prototype.with.call(null, 0, 1); });          // TypeError
thr("toReversed-undef", function () { Array.prototype.toReversed.call(undefined); }); // TypeError
thr("with-huge", function () { Array.prototype.with.call({ length: Math.pow(2, 32) }, 0, 1); }); // RangeError
thr("toSpliced-huge", function () { Array.prototype.toSpliced.call({ length: Infinity }, 0, 0); }); // RangeError

p("with", [1, 2, 3].with(1, 9).join(","));        // 1,9,3
p("toReversed", [1, 2, 3].toReversed().join(",")); // 3,2,1
p("toSorted", [3, 1, 2].toSorted().join(","));     // 1,2,3
p("toSpliced", [1, 2, 3].toSpliced(1, 1, 9).join(",")); // 1,9,3

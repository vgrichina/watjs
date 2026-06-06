// TypedArray.prototype.sort: numeric default, comparator, in-place write-back.
function p(n, v) { print(n + "=" + v); }
p("default", new Int8Array([3, 1, 2]).sort().join(","));        // 1,2,3
p("numeric", new Float64Array([10, 2, 1]).sort().join(","));     // 1,2,10
p("comparator", new Int8Array([3, 1, 2]).sort(function (a, b) { return b - a; }).join(",")); // 3,2,1
p("negative", new Int8Array([3, -1, 2]).sort().join(","));       // -1,2,3
p("inplace", (function () { var t = new Int8Array([3, 1, 2]); t.sort(); return t[0] + "," + t[2]; })()); // 1,3
// Array sort is unaffected (string default)
p("array-string", [10, 2, 1].sort().join(","));                  // 1,10,2
p("array-cmp", [3, 1, 2].sort(function (a, b) { return a - b; }).join(",")); // 1,2,3

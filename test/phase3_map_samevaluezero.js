// Map/Set keys use SameValueZero: NaN matches NaN, +0 matches -0.
function p(n, v) { print(n + "=" + v); }
var m = new Map(); m.set(NaN, 1); p("map-nan", m.get(NaN));   // 1
m.set(-0, "z"); p("map-zero", m.get(0) + "," + m.size);        // z,2 (NaN + the merged 0)
p("set-nan-dedup", new Set([NaN, NaN, NaN]).size);            // 1
p("set-has-nan", new Set([NaN]).has(NaN));                    // true
p("set-zero-dedup", new Set([0, -0]).size);                   // 1
p("map-normal", new Map([["a", 1]]).get("a"));                 // 1
p("map-delete-nan", (function () { var x = new Map(); x.set(NaN, 1); x.delete(NaN); return x.has(NaN); })()); // false

// Optional call ?.() invokes the receiver (or short-circuits to undefined).
function p(n, v) { print(n + "=" + v); }
var o = { m: function () { return 5; } };
p("method", o.m?.());              // 5
p("method-args", o.m?.(1, 2));      // 5
p("fn", (function () { return 9; })?.()); // 9
p("null", (null)?.());              // undefined
p("chain", o?.m?.());               // 5
p("missing", ({}).nope?.());        // undefined
p("prop", ({ a: { b: 7 } }).a?.b);    // 7
p("idx", ({ a: [10] }).a?.[0]);      // 10

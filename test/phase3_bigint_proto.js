// BigInt.prototype methods (property access on a BigInt primitive).
function p(n, v) { print(n + "=" + v); }
p("toString", (10n * 10n).toString());     // 100
p("hex", (255n).toString(16));              // ff
p("bin", (5n).toString(2));                 // 101
p("neg", (-255n).toString(16));             // -ff
p("zero", (0n).toString());                 // 0
p("valueOf", (5n).valueOf());               // 5
p("radix-range", (function () { try { (5n).toString(37); return "no"; } catch (e) { return e.constructor.name; } })()); // RangeError
p("brand", (function () { try { BigInt.prototype.toString.call(5); return "no"; } catch (e) { return e.constructor.name; } })()); // TypeError

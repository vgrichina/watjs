// BigInt **, bitwise/shift operators, and BigInt.asIntN/asUintN.
function p(n, v) { print(n + "=" + v); }
p("pow", (2n ** 10n).toString());          // 1024
p("pow0", (5n ** 0n).toString());           // 1
p("and", (12n & 10n).toString());           // 8
p("or", (12n | 10n).toString());            // 14
p("xor", (12n ^ 10n).toString());           // 6
p("shl", (1n << 4n).toString());             // 16
p("shr", (256n >> 2n).toString());           // 64
p("ursh", (function () { try { return (8n >>> 1n).toString(); } catch (e) { return e.constructor.name; } })()); // TypeError
p("neg-exp", (function () { try { return (2n ** -1n).toString(); } catch (e) { return e.constructor.name; } })()); // RangeError
p("asUintN", BigInt.asUintN(8, 256n).toString());   // 0
p("asUintN-neg", BigInt.asUintN(8, -1n).toString()); // 255
p("asIntN", BigInt.asIntN(8, 128n).toString());      // -128
p("num-pow", (2 ** 10));                              // 1024

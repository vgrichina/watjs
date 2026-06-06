// Number.prototype.toExponential() with no argument uses minimal digits.
function p(n, v) { print(n + "=" + v); }
p("123", (123).toExponential());        // 1.23e+2
p("1.5", (1.5).toExponential());         // 1.5e+0
p("100", (100).toExponential());         // 1e+2
p("zero", (0).toExponential());          // 0e+0
p("neg", (-12.5).toExponential());       // -1.25e+1
p("small", (0.001).toExponential());     // 1e-3
p("explicit-2", (123).toExponential(2)); // 1.23e+2
p("explicit-4", (123).toExponential(4)); // 1.2300e+2

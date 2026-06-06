// Symbol() description is undefined; Symbol("") is "". valueOf returns the symbol.
function p(n, v) { print(n + "=" + v); }
p("noarg", typeof Symbol().description);       // undefined
p("empty", typeof Symbol("").description);      // string
p("empty-val", Symbol("").description === ""); // true
p("with", Symbol("x").description);            // x
p("noarg-ts", String(Symbol()));               // Symbol()
p("empty-ts", String(Symbol("")));             // Symbol()
p("desc-ts", String(Symbol("d")));             // Symbol(d)
p("valueOf", (function () { var s = Symbol("a"); return s.valueOf() === s; })()); // true
p("for-desc", Symbol.for("k").description);    // k
p("computed-noarg", (function () { var o = { [Symbol()]: 1 }; return Object.getOwnPropertySymbols(o).length; })()); // 1

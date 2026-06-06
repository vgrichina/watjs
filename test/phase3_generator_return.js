// Generator .return(v) closes and returns {value, done:true}; .throw propagates.
function p(n, v) { print(n + "=" + v); }
function* g() { yield 1; yield 2; yield 3; }
var i = g(); i.next();
p("return", JSON.stringify(i.return(9)));       // {"value":9,"done":true}
p("after-return", JSON.stringify(i.next()));     // {"done":true}
function* g2() { yield 1; }
var i2 = g2();
p("throw", (function () { try { i2.throw(new Error("boom")); return "no"; } catch (e) { return e.message; } })()); // boom
p("normal", [...g()].join(","));                 // 1,2,3

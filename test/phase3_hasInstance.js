// Symbol.hasInstance customizes instanceof.
function p(n, v) { print(n + "=" + v); }
var C = { [Symbol.hasInstance]: function (x) { return x === 5; } };
p("custom", 5 instanceof C);        // true
p("custom-no", 6 instanceof C);      // false
p("array", [] instanceof Array);     // true
p("object", {} instanceof Object);   // true
function F() {} var f = new F();
p("vmfn", f instanceof F);           // true
function G() {} Object.defineProperty(G, Symbol.hasInstance, { value: function () { return true; } });
p("fn-override", 1 instanceof G);    // true

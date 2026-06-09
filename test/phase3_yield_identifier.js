// In sloppy, non-generator code `yield` is a plain Identifier; inside a generator
// body it's the yield-expression.
var yield = 5;
if (yield !== 5) throw "var yield";
function yieldFn(){ return 1; }
if (yieldFn() !== 1) throw "fn name";
var y2 = 7;
var [a = (function(){ return yield; })()] = [];  // 'yield' here is the outer var? no — fresh; just ensure parse
// destructuring default referencing a `yield` identifier
var yld = 9; var [b = yld] = []; if (b !== 9) throw "dstr default";
// inside a generator, yield is the yield-expression
function* g(){ var r = yield 1; return r + 10; }
var it = g();
if (it.next().value !== 1) throw "gen y1";
if (it.next(5).value !== 15) throw "gen y2";
// yield* delegation
function* inner(){ yield "a"; yield "b"; }
function* outer(){ yield* inner(); yield "c"; }
if ([...outer()].join(",") !== "a,b,c") throw "yield*";
// a non-generator function nested in a generator: yield is an identifier there
function* h(){ var f = function(){ var yield = 3; return yield; }; return f(); }
if (h().next().value !== 3) throw "nested yield ident";
print("ok");

// ASI restricted productions: a LineTerminator after return/break/continue/yield
// terminates the statement (the token on the next line is separate).
function f() { return
  5; }
assert(f() === undefined, "return + newline → return;");

var i;
outer: for (i = 0; i < 3; i++) { for (var j = 0; j < 3; j++) { break
  outer; } }
assert(i === 3, "break + newline → plain break (label on next line ignored)");

function* g() { yield
  1; }
assert(g().next().value === undefined, "yield + newline → yield undefined");

// non-ASI: same-line forms still work
function h() { return 7; }
assert(h() === 7, "return EXPR same line");
outer2: for (i = 0; i < 3; i++) { for (var k = 0; k < 3; k++) { break outer2; } }
assert(i === 0, "labeled break same line");
function* g2() { yield 5; }
assert(g2().next().value === 5, "yield EXPR same line");

// yield EXPRESSION form (not statement) also honors the restricted production
function* ge() { var x = yield
  1; return x; }
var ite = ge(); ite.next();
assert(ite.next(99).value === 99, "yield-expr + newline → yield undefined");

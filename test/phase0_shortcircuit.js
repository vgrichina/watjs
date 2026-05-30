print("start");
false && print("AND-should-not-print");
true || print("OR-should-not-print");
true && print("AND-should-print");
false || print("OR-should-print");
(1 > 2) ? print("ternary-then-skip") : print("ternary-else-print");

// `return <short-circuit ending in a call>` must not be miscompiled by the
// tail-call peephole: when the call is skipped, the falsy/short value is returned.
function callee() { return 7; }
function retAnd(c) { return c && callee(); }
function retOr(c) { return c || callee(); }
function retTern(c) { return c ? callee() : 0; }
print("retAnd(false)=" + retAnd(false));   // false, not undefined
print("retAnd(true)=" + retAnd(true));     // 7
print("retOr(true)=" + retOr(true));       // true
print("retOr(false)=" + retOr(false));     // 7
print("retTern(true)=" + retTern(true));   // 7
print("retTern(false)=" + retTern(false)); // 0
print("end");

print("start");
false && print("AND-should-not-print");
true || print("OR-should-not-print");
true && print("AND-should-print");
false || print("OR-should-print");
(1 > 2) ? print("ternary-then-skip") : print("ternary-else-print");
print("end");

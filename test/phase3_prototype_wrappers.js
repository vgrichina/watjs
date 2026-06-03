function p(n,v){print(n+"="+v);}
p("bool-valueOf", Boolean.prototype.valueOf());   // false
p("bool-toString", Boolean.prototype.toString()); // false
p("num-valueOf", Number.prototype.valueOf());     // 0
p("num-toString", Number.prototype.toString());   // 0
p("str-toString", JSON.stringify(String.prototype.toString())); // ""
p("str-valueOf", JSON.stringify(String.prototype.valueOf()));   // ""
p("no-prim-leak", Object.keys(String.prototype).indexOf("__prim__")); // -1
p("normal-str", "abc".toUpperCase());  // ABC
p("normal-bool", false.toString());    // false

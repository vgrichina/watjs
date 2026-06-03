function p(n,v){print(n+"="+v);}
var o = { bre\u0061k(){ return 42; } };
p("escaped-method", o["break"]());
var inter\u0066ace = 7;
p("escaped-var", interface);
var o2 = { \u0069f: 1 };
p("start-escaped-key", o2.if);
var pl\u0061in = 9;
p("mid-escaped-var", plain);
var o3 = { \u{63}urly: 5 };
p("curly-key", o3.curly);
p("str-curly", "x\u{61}y");
p("str-4hex", "a\u0062c");
var normal = 3; p("normal", normal);
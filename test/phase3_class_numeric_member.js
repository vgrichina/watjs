function p(n,v){print(n+"="+v);}
class A { 0x10(){ return "hex"; } 1e3(){ return "exp"; } 5(){ return 5; } "str"(){ return "s"; } }
var a = new A();
p("hex-method", a[16]());     // hex
p("exp-method", a[1000]());   // exp
p("dec-method", a[5]());      // 5
p("str-method", a.str());     // s
p("hex-name", a[16].name);    // 16
class B { 0x10 = "f"; 5 = 50; "k" = "s"; }
var b = new B();
p("hex-field", b[16]);        // f
p("dec-field", b[5]);         // 50
p("str-field", b.k);          // s

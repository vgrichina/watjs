function p(n,v){print(n+"="+v);}
var k = "m";
class C { [k](){} ["bar"](){} static [k+"S"](){} get [k+"G"](){return 1;} }
p("name", C.prototype.m.name);          // m
p("name2", C.prototype.bar.name);        // bar
p("static-name", C.mS.name);             // mS
p("getter-name", Object.getOwnPropertyDescriptor(C.prototype,"mG").get.name); // get mG
p("nonenum", Object.getOwnPropertyDescriptor(C.prototype,"m").enumerable);  // false
p("not-in-keys", Object.keys(C.prototype).indexOf("m") < 0);  // true
p("callable", (new C()).m === C.prototype.m);  // true

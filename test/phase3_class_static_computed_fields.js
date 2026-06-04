function p(n,v){print(n+"="+v);}
class A { static sx = 10; ix = 20; }
p("static-on-class", A.sx);            // 10
p("instance-field", (new A()).ix);     // 20
p("instance-not-static", A.ix);        // undefined
class B { static [1.1] = 2; [2.2] = 3; }
p("static-computed", B[1.1]);          // 2
p("instance-computed", (new B())[2.2]);// 3
p("inst-computed-own", (new B()).hasOwnProperty("2.2")); // true
class C { static a = 1; static b = 2; i = "x"; }
p("static-multi", C.a + C.b);          // 3
p("mix", C.a + (new C()).i);           // 1x
class D { m(){return 9;} [k] = 5; static s = 7; }
var k = "dyn";
p("method+fields", (new D()).m() + "," + (new D()).dyn + "," + D.s); // 9,5,7

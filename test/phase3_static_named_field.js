function p(n,v){print(n+"="+v);}
class A { static sx = 10; ix = 20; }
var a = new A();
p("static-on-class", A.sx);             // 10
p("instance-field", a.ix);              // 20
p("instance-not-on-class", A.ix);       // undefined
p("static-multi", (function(){ class B { static a=1; static b=2; static c=3; } return B.a+B.b+B.c; })()); // 6
p("static+instance", (function(){ class C { static s="S"; i="I"; } var x=new C(); return C.s + x.i; })()); // SI
p("static-expr", (function(){ class D { static v = 2 * 21; } return D.v; })()); // 42

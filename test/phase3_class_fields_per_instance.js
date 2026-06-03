function p(n,v){print(n+"="+v);}
class A { x = 1; y = 2; }
var a = new A();
p("field-x", a.x);
p("own-x", a.hasOwnProperty("x"));               // true
p("not-on-proto", A.prototype.hasOwnProperty("x")); // false
p("proto-keys", JSON.stringify(Object.keys(A.prototype))); // []
p("inst-keys", JSON.stringify(Object.keys(a)));  // ["x","y"]
p("per-instance", (function(){ var a1=new A(),a2=new A(); a1.x=9; return a2.x; })()); // 1
class B { v = 10; m(){ return this.v; } }
p("field+method", (new B()).m());                // 10
class C { a = 1; b = this.a + 1; }
p("refs-this", (new C()).b);                      // 2
class D { n; }
var d = new D();
p("no-init-own", d.hasOwnProperty("n"));          // true
p("no-init-val", d.n === undefined);              // true
class E { f = "x"; constructor(){ this.g = this.f + "y"; } }
p("field-then-ctor", (new E()).g);                // xy

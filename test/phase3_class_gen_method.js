function p(n,v){print(n+"="+v);}
class A { *gen(){ yield 1; yield 2; } }
var it=new A().gen();
p("g1", it.next().value); p("g2", it.next().value); p("done", it.next().done);
class B { *count(n){ for(var i=0;i<n;i++) yield i; } }
p("spread", [...new B().count(3)].join(","));
class C { *m([x,y]){ yield x; yield y; } }
p("dstr-param", [...new C().m([7,8])].join(","));
class D { static *s(){ yield 99; } }
p("static-gen", D.s().next().value);
var k="g"; class E { *[k](){ yield 5; } }
p("computed-gen", new E().g().next().value);
class F { plain(){ return 42; } get x(){ return 7; } static st(){ return 8; } }
var f=new F(); p("plain", f.plain()); p("getter", f.x); p("static-plain", F.st());
class G { static(){ return 1; } *get(){ yield 2; } }
var g=new G(); p("named-static", g.static()); p("gen-named-get", g.get().next().value);

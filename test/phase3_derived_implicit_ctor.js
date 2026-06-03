function p(n,v){print(n+"="+v);}
p("field-from-parent", (function(){ class A{ constructor(){ this.v=1; } } class B extends A {} return new B().v; })());
p("instanceof-parent", (function(){ class A{} class B extends A {} return (new B()) instanceof A; })());
p("instanceof-self", (function(){ class A{} class B extends A {} return (new B()) instanceof B; })());
p("inherited-method", (function(){ class C{ constructor(){ this.x=9; } m(){ return 42; } } class D extends C {} var d=new D(); return d.x + d.m(); })());
p("parent-proto-chain", (function(){ class A{ g(){ return "g"; } } class B extends A {} return new B().g(); })());

function p(n,v){print(n+"="+v);}
function t(n,f){ try{ p(n,f()); }catch(e){ p(n,"THROW:"+e.name); } }
t("call-no-ctor", function(){ class C{} return C(); });
t("call-with-ctor", function(){ class C{ constructor(){} } return C(); });
t("derived-call", function(){ class A{} class B extends A{} return B(); });
t("new-ok", function(){ class C{ constructor(){this.x=5;} } return new C().x; });
t("empty-new-ok", function(){ class C{} return typeof new C(); });
t("super-call-ok", function(){ class A{ constructor(){this.v=7;} } class B extends A{ constructor(){ super(); } } return new B().v; });
t("method-ok", function(){ class C{ m(){return 9;} } return new C().m(); });
t("static-ok", function(){ class C{ static s(){return 3;} } return C.s(); });
t("regular-fn-ok", function(){ function f(){return 1;} return f(); });

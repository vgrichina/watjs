function p(n,v){print(n+"="+v);}
function t(n,f){ try{ p(n,f()); }catch(e){ p(n,"THROW:"+e.name); } }
t("undeclared-throws", function(){ "use strict"; undeclaredXYZ = 5; return undeclaredXYZ; });
t("declared-ok", function(){ "use strict"; var x; x = 5; return x; });
t("let-ok", function(){ "use strict"; let y=1; y=2; return y; });
t("param-ok", function(){ "use strict"; return (function(a){ a=9; return a; })(1); });
t("outer-ok", function(){ "use strict"; var z=0; function g(){ z=5; } g(); return z; });
t("const-throws", function(){ "use strict"; const c=5; c=6; return c; });
t("obj-prop-ok", function(){ "use strict"; var o={}; o.x=5; return o.x; });
t("sloppy-undeclared-ok", function(){ sloppyVarABC = 7; return sloppyVarABC; });
p("program-strict-undeclared", (function(){ try{ eval('"use strict"; progUndecl=1;'); return "no"; }catch(e){ return e.name; } })());

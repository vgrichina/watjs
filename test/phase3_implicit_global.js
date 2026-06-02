function p(n,v){print(n+"="+v);}
function t(n,f){ try{ p(n,f()); }catch(e){ p(n,"THROW:"+e.name); } }
t("arrow-implicit-global", function(){ var af=()=>{ implG1=1; }; af(); return implG1; });
t("nested-fn-implicit-global", function(){ function g(){ implG2=2; } g(); return implG2; });
t("deep-implicit-global", function(){ (function(){ (function(){ implG3=3; })(); })(); return implG3; });
t("closure-updates-outer", function(){ var x=5; (function(){ x=9; })(); return x; });
t("counter-closure", function(){ var c=0; var inc=()=>{c++;}; inc(); inc(); return c; });
t("const-reassign-sloppy-throws", function(){ const k=5; k=6; return k; });
t("strict-undeclared-throws", function(){ "use strict"; undeclSloppyX=1; return undeclSloppyX; });

function p(n,v){print(n+"="+v);}
function t(n,f){ try{ p(n,f()); }catch(e){ p(n,"THROW:"+e.name); } }
t("obj-rhs", function(){ return ({}) instanceof {}; });
t("num-rhs", function(){ return 5 instanceof 5; });
t("null-rhs", function(){ return ({}) instanceof null; });
t("string-rhs", function(){ return ({}) instanceof "x"; });
t("normal", function(){ function F(){} return new F() instanceof F; });
t("class", function(){ class C{} return new C() instanceof C; });
t("array", function(){ return [] instanceof Array; });
t("error-subclass", function(){ return new TypeError() instanceof Error; });

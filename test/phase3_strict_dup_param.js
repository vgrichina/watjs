function p(n,v){print(n+"="+v);}
function t(n,f){ try{ f(); p(n,"NO-THROW"); }catch(e){ p(n,e.name); } }
t("dup-param", function(){ eval("'use strict'; function f(a,a){}"); });
t("dup-param-expr", function(){ eval("'use strict'; var g=function(x,y,x){};"); });
t("dup-param-3", function(){ eval("'use strict'; function f(a,b,c,a){}"); });
t("sloppy-dup-ok", function(){ return eval("(function(a,a){return a;})(1,2)"); });
t("distinct-ok", function(){ return eval("'use strict'; (function(a,b){return a+b;})(2,3)"); });

function p(n,v){print(n+"="+v);}
function t(n,f){ try{ f(); p(n,"NO-THROW"); }catch(e){ p(n,e.name); } }
t("strict-with", function(){ eval("'use strict'; with({}){}"); });
t("strict-with-body", function(){ eval("'use strict'; var o={}; with(o){ x; }"); });
t("strict-normal-ok", function(){ return eval("'use strict'; var x=5; x"); });

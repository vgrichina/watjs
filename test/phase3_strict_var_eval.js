function p(n,v){print(n+"="+v);}
function t(n,f){ try{ f(); p(n,"NO-THROW"); }catch(e){ p(n,e.name); } }
t("var-eval", function(){ eval("'use strict'; var eval;"); });
t("var-arguments", function(){ eval("'use strict'; var arguments = 1;"); });
t("let-eval", function(){ eval("'use strict'; let eval = 1;"); });
t("const-eval", function(){ eval("'use strict'; const eval = 1;"); });
t("sloppy-ok", function(){ return eval("var eval2 = 5; eval2"); });
t("normal-ok", function(){ return eval("'use strict'; var x = 5; x"); });

function p(n,v){print(n+"="+v);}
function t(n,f){ try{ f(); p(n,"NO-THROW"); }catch(e){ p(n,e.name); } }
t("eval-assign", function(){ eval("'use strict'; eval = 42;"); });
t("arguments-assign", function(){ eval("'use strict'; arguments = 1;"); });
t("eval-compound", function(){ eval("'use strict'; eval += 1;"); });
t("eval-increment", function(){ eval("'use strict'; eval++;"); });
t("sloppy-allows", function(){ eval("var eval2; eval2 = 42;"); });
t("strict-normal-ok", function(){ eval("'use strict'; var x; x = 5;"); });
t("eval-as-value-ok", function(){ "use strict"; var f = eval; return typeof f; });
t("eval-call-ok", function(){ "use strict"; return eval("1+1"); });
t("arguments-index-ok", function(){ "use strict"; return (function(){ return arguments[0]; })(7); });

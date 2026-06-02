function p(n,v){print(n+"="+v);}
function t(n,f){ try{ f(); p(n,"NO-THROW"); }catch(e){ p(n,e.name); } }
t("new-neg", function(){ new Array(-1); });
t("new-huge", function(){ new Array(4294967296); });
t("new-frac", function(){ new Array(1.5); });
t("new-nan", function(){ new Array(NaN); });
t("assign-neg", function(){ var a=[]; a.length=-1; });
p("valid-3", new Array(3).length);
p("valid-0", new Array(0).length);
p("valid-args", new Array(1,2,3).join(","));
p("valid-max-ok", (function(){ try{ new Array(10); return "ok"; }catch(e){ return e.name; } })());

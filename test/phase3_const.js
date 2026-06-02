function p(n,v){print(n+"="+v);}
function t(n,f){ try{ p(n,f()); }catch(e){ p(n,"THROW:"+e.name); } }
t("reassign-throws", function(){ const c=5; c=6; return c; });
t("compound-throws", function(){ const c=5; c+=1; return c; });
t("read-ok", function(){ const c=42; return c; });
t("loop-redefine-ok", function(){ var s=0; for(var i=0;i<3;i++){ const c=i*2; s+=c; } return s; });
t("forof-ok", function(){ var s=""; for(const x of [1,2,3]) s+=x; return s; });
t("let-reassign-ok", function(){ let x=1; x=2; return x; });
t("object-mutate-ok", function(){ const o={a:1}; o.a=2; return o.a; });
t("const-fn-ok", function(){ const f=()=>7; return f(); });
t("param-ok", function(){ return (function(a){ a=5; return a; })(1); });

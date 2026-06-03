function p(n,v){print(n+"="+v);}
function t(n,f){ try{ p(n,f()); }catch(e){ p(n,"THROW:"+e.name); } }
t("call-nonfn", function(){ return Function.prototype.call.call(5); });
t("apply-nonfn", function(){ return Function.prototype.apply.call(5,null,[]); });
t("bind-nonfn", function(){ return Function.prototype.bind.call({}); });
t("call-ok", function(){ function f(){return this.v;} return f.call({v:7}); });
t("apply-ok", function(){ function f(a,b){return a+b;} return f.apply(null,[2,3]); });
t("bind-ok", function(){ function f(a){return a+this.v;} return f.bind({v:10})(5); });

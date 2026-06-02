function p(n,v){print(n+"="+v);}
p("nested-arrow", (function(){ var o={v:5,f(){return (()=>(()=>this.v)())();}}; return o.f(); })());
p("arrow-in-map", (function(){ var o={v:7,f(){return [1].map(()=>this.v)[0];}}; return o.f(); })());
p("arrow-counter", (function(){ function C(){ this.n=0; this.inc=()=>{this.n++;}; } var c=new C(); c.inc(); c.inc(); return c.n; })());
p("regular-fn-this-unchanged", (function(){ var o={v:3,f(){return this.v;}}; return o.f(); })());
p("nested-regular-fn-this", (function(){ var o={v:1,f(){function g(){return typeof this;} return g();}}; return o.f(); })());
p("rest-arrow", ((...a)=>a.length)(1,2,3));
p("arrow-args-lexical", (function g(){ return (()=>arguments[0])(); })(7));
p("arrow-in-forEach", (function(){ var o={vals:[1,2,3],sum:0,run(){ this.vals.forEach(v=>{this.sum+=v;}); return this.sum; }}; return o.run(); })());

function p(n,v){print(n+"="+v);}
p("eval-fn-call", (eval("(function(){return 7})"))());
p("eval-fn-stored", (function(){ var g=eval("(function(x){return x*3})"); return g(4); })());
p("Function-call", Function("a","b","return a+b")(2,3));
p("new-Function", (new Function("x","return x*x"))(5));
p("Function-noargs", Function("return 42")());
p("Function-name", Function("return 1").name);
p("eval-fn-closure-global", (function(){ globalThis.GV=11; return eval("(function(){return GV})")(); })());
p("nested-eval-fn", (function(){ var f=eval("(function(){ return eval('(function(){return 9})')(); })"); return f(); })());

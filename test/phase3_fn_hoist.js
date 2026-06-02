function p(n,v){print(n+"="+v);}
p("call-before-decl", (function(){ return f(); function f(){return 7;} })());
p("init-from-hoisted", (function(){ var a=g(); function g(){return 3;} return a; })());
p("nested", (function(){ function outer(){ return inner(); function inner(){return 42;} } return outer(); })());
p("reassign-not-clobbered", (function(){ f=5; function f(){return 1;} return f; })());
p("call-then-reassign", (function(){ var a=h(); function h(){return 9;} h=10; return a+","+h; })());
p("iife-name-not-leaked", (function(){ (function gg(){return 1;})(); return typeof gg; })());
p("mutual", (function(){ function ev(n){return n===0?true:od(n-1);} function od(n){return n===0?false:ev(n-1);} return ev(10); })());

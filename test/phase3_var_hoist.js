function p(n,v){print(n+"="+v);}
p("read-before-assign", (function(){ var v; return v===undefined; })());
p("closure-assign", (function(){ var v; function g(){v=5;} g(); return v; })());
p("no-reset-on-redeclare", (function(){ var v=5; var v; return v; })());
p("shadow-outer", (function(){ var v=99; return (function(){ var v; return v; })(); })());
p("multi-decl", (function(){ var a,b,c; b=2; return (a===undefined)+","+b+","+(c===undefined); })());
p("loop-redeclare", (function(){ var s=0; for(var i=0;i<3;i++){ var t; t=(t===undefined?10:t)+i; s+=t; } return s; })());
p("typeof-bare", (function(){ var x; return typeof x; })());

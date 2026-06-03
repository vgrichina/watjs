function p(n,v){print(n+"="+v);}
function thr(fn){ try{ fn(); return "no-throw"; }catch(e){ return e.constructor.name; } }
p("new-num", thr(function(){ new 1; }));        // TypeError
p("new-str", thr(function(){ new "s"; }));       // TypeError
p("new-true", thr(function(){ new true; }));     // TypeError
p("new-null", thr(function(){ new null; }));     // TypeError
p("new-obj", thr(function(){ new {}; }));         // TypeError
p("new-wrapper", thr(function(){ new new Number(1); })); // TypeError
p("new-math", thr(function(){ new Math.max(); })); // TypeError (Math.max() returns a number)
// valid constructions still work
function F(){ this.x=1; }
p("valid", (new F()).x);                          // 1
p("valid-new-num-ctor", (new Number(5)).valueOf()); // 5

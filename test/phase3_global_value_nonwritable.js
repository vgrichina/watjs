function p(n,v){print(n+"="+v);}
function attrs(n){ var d=Object.getOwnPropertyDescriptor(globalThis,n); return d.writable+","+d.enumerable+","+d.configurable; }
p("NaN-attrs", attrs("NaN"));         // false,false,false
p("Infinity-attrs", attrs("Infinity")); // false,false,false
p("undefined-attrs", attrs("undefined")); // false,false,false
p("sloppy-NaN", (function(){ NaN = 5; return NaN !== NaN; })());   // true (no-op)
p("sloppy-undef", (function(){ undefined = 1; return typeof undefined; })()); // undefined
p("const-throws", (function(){ try{ eval("const c=1; c=2;"); return "no"; }catch(e){ return e.constructor.name; } })()); // TypeError
p("strict-NaN", (function(){ "use strict"; try{ NaN=5; return "no"; }catch(e){ return e.constructor.name; } })()); // TypeError
p("normal-var", (function(){ var x=1; x=2; return x; })()); // 2
p("implicit-global", (function(){ ig=7; return ig; })()); // 7

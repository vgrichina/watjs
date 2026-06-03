function p(n,v){print(n+"="+v);}
function G(){ this.nt = new.target; }
p("ctor", (new G()).nt === G);          // true
function H(){ return new.target; }
p("plain", H());                         // undefined
p("ctor-direct", (new H()).constructor === H ? "ok" : "x"); // ok (new.target=H, returns it? no—returns H which is fn→used as obj)
function J(){ var a = ()=>new.target; this.r = (a() === J); }
p("arrow-inherit", (new J()).r);         // true
function K(){ var a = ()=>new.target; return a(); }
p("arrow-plain", K());                   // undefined
p("toplevel", typeof (function(){ return new.target; })()); // undefined

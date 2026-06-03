function p(n,v){print(n+"="+v);}
function F(){ this.x=1; }
p("paren", (new (F)()).x);                 // 1
function G(a){ this.a=a; }
p("paren-args", (new (G)(7)).a);           // 7
function Bar(){ this.z=5; }
p("bound-paren", (new (Bar.bind(null))()).z); // 5
p("plain", (new F()).x);                   // 1
var NS={}; NS.Inner=function(){ this.k=3; };
p("member", (new NS.Inner()).k);           // 3

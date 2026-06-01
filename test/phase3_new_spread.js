function p(n,v){print(n+"="+v);}
function F(a,b){ this.s=a+"-"+b; }
p("spread", new F(...["x","y"]).s);
p("mixed", (function(){function G(a,b,c){this.t=a+b+c;}return new G(1,...[2,3]).t;})());
p("noargs", (function(){function H(){this.u=9;}return new H().u;})());
p("empty-spread", (function(){function J(a){this.v=a;}return new J(...[]).v;})());
p("date-spread", new Date(...[2000,0,1]).getFullYear());

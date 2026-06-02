function p(n,v){print(n+"="+v);}
p("single", ((a,)=>a)(5));
p("multi", ((a,b,)=>a+b)(1,2));
p("default", ((a,b=2,)=>a+b)(1));
p("rest", ((a,...r)=>a+":"+r.length)(1,2,3));
p("none-still-ok", (()=>9)());

function p(n,v){print(n+"="+v);}
var r=/\d/g;
p("ex1", r.exec("a1b2")[0]+"@"+r.lastIndex);
p("ex2", r.exec("a1b2")[0]+"@"+r.lastIndex);
p("ex3", r.exec("a1b2")+"@"+r.lastIndex);
var r2=/\d/; r2.exec("a1b2"); p("nonglobal", r2.lastIndex);
var re=/\w/g, s="", m; while((m=re.exec("xyz"))!==null){ s+=m[0]; } p("loop", s);
p("match-g", JSON.stringify("a1b2c3".match(/\d/g)));
var r3=/x/g; r3.lastIndex=10; p("past-end", r3.exec("xax")+"@"+r3.lastIndex);

function p(n,v){print(n+"="+v);}
function f3(a,b,c){}
p("bind-0", f3.bind(null).length);        // 3
p("bind-1", f3.bind(null,1).length);      // 2
p("bind-2", f3.bind(null,1,2).length);    // 1
p("bind-all", f3.bind(null,1,2,3).length);// 0
p("bind-over", f3.bind(null,1,2,3,4).length); // 0
function f0(){}
p("bind-empty", f0.bind(null,1).length);  // 0
// bound fn still callable with correct this/args
function add(a,b){ return a+b; }
p("bind-call", add.bind(null,10)(5));     // 15
p("desc", (function(){ var d=Object.getOwnPropertyDescriptor(f3.bind(null,1),"length"); return d.value+","+d.writable+","+d.enumerable+","+d.configurable; })()); // 2,false,false,true

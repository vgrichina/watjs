function p(n,v){print(n+"="+v);}
// finally runs on return from try
p("run", (function(){var s="";function f(){try{s+="t";return;}finally{s+="f";}}f();return s;})());
// finally's return overrides try's return
p("override", (function(){function f(){try{return 1;}finally{return 2;}}return f();})());
// finally's return overrides a throw
p("over-throw", (function(){function f(){try{throw 9;}finally{return 5;}}return f();})());
// return value computed before finally, returned after
p("value", (function(){var log="";function f(){try{return (log+="a","X");}finally{log+="b";}}var r=f();return r+log;})());
// nested try/finally: both run, inner first
p("nested", (function(){var s="";function f(){try{try{return "r";}finally{s+="i";}}finally{s+="o";}}f();return s;})());
// finally runs even when try returns from a loop
p("loop", (function(){function f(){for(var i=0;i<3;i++){try{if(i===1)return i;}finally{}}return -1;}return f();})());

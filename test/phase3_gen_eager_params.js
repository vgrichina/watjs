function p(n,v){print(n+"="+v);}
function t(n,f){ try{ f(); p(n,"NOTHROW"); }catch(e){ p(n,e.name); } }
p("basic", (function(){function*g(){yield 1;yield 2;}var it=g();return it.next().value+","+it.next().value;})());
p("default", (function(){function*g(x=5){yield x;}return g().next().value;})());
p("eager", (function(){var log="";function*g(a=(log+="D",1)){yield a;}g();return log;})());
t("unres-call", function(){ function*g(x=undefinedVar){yield x;} g(); });
t("dstr-null", function(){ function*g([x]){yield x;} g(null); });
p("dstr", (function(){function*g([a,b]){yield a;yield b;}var it=g([3,4]);return it.next().value+","+it.next().value;})());
p("for-of", (function(){function*g(){yield 1;yield 2;yield 3;}var s="";for(var x of g())s+=x;return s;})());
p("gen-meth", (function(){var o={*m(){yield 9;}};return o.m().next().value;})());
p("class-gen", (function(){class C{*m(){yield 7;}}return new C().m().next().value;})());
p("next-arg", (function(){function*g(){var x=yield 1;yield x;}var it=g();it.next();return it.next(42).value;})());

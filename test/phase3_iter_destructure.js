function p(n,v){print(n+"="+v);}
function t(n,f){ try{ f(); p(n,"NOTHROW"); }catch(e){ p(n,e instanceof TypeError?"TE":e.name); } }
p("basic", (function(){var [a,b]=[1,2];return a+","+b;})());
p("default", (function(){var [a,b=9]=[1];return a+","+b;})());
p("rest", (function(){var [a,...r]=[1,2,3];return a+":"+JSON.stringify(r);})());
p("hole", (function(){var [,a,,b]=[1,2,3,4];return a+","+b;})());
p("nested", (function(){var [[a],[b]]=[[1],[2]];return a+","+b;})());
p("string", (function(){var [a,b,c]="xyz";return a+b+c;})());
p("param", (function([a,b]){return a+b;})([3,4]));
p("swap", (function(){var a=1,b=2;[a,b]=[b,a];return a+","+b;})());
p("short", (function(){var [a,b]=[1];return a+","+b;})());
p("gen", (function(){function* g(){yield 1;yield 2;} var [a,b]=g(); return a+","+b;})());
t("iter-throws", function(){ var it={}; it[Symbol.iterator]=function(){throw new Error("E");}; var [x]=it; });
t("not-iterable", function(){ var [x]={a:1}; });

function p(n,v){print(n+"="+v);}
p("nest", `${`in${2}`}`);
p("nest2", `a${`b${1}c`}d`);
p("brace", `${ {a:5}.a }`);
p("deep", `${`${`${3}`}`}`);
p("multi", `${1}-${2}-${3}`);
p("tagged-nest", (function(){function t(s){return s[0]+s[1];} return t`x${`y${9}`}z`;})());
p("plain", `a${1+1}b`);

function p(n,v){print(n+"="+v);}
p("obj-of", (function(){var s="";for(const {x} of [{x:1},{x:2}]){s+=x;}return s;})());
p("ary-of", (function(){var s="";for(const [a,b] of [[1,2],[3,4]]){s+=a+b+" ";}return s;})());
p("rename", (function(){var s="";for(var {k:v} of [{k:"q"}]){s+=v;}return s;})());
p("default", (function(){var s="";for(const {n=9} of [{},{n:5}]){s+=n+" ";}return s;})());
p("nested", (function(){var s="";for(const [[a],[b]] of [[[1],[2]]]){s+=a+b;}return s;})());
p("ary-rest", (function(){var s="";for(const [a,...r] of [[1,2,3]]){s+=a+":"+r.join(",");}return s;})());
p("single", (function(){var s="";for(const x of [1,2,3]){s+=x;}return s;})());
p("forin", (function(){var s="";for(const k in {p:1,q:2}){s+=k;}return s;})());

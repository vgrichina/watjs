function p(n,v){print(n+"="+v);}
var r = Object.assign(1, {a:1});
p("num-typeof", typeof r);
p("num-valueOf", r.valueOf());
p("num-a", r.a);
var rb = Object.assign(true, {x:5});
p("bool-typeof", typeof rb);
p("bool-x", rb.x);
var rs = Object.assign("ab", {y:7});
p("str-typeof", typeof rs);
p("str-y", rs.y);
p("obj-passthrough", (function(){ var o={}; return Object.assign(o,{z:9})===o && o.z===9; })());

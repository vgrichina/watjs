function p(n,v){print(n+"="+v);}
// arguments in a plain new
var a = new function(){ this.n = arguments.length; }(1,2,3);
p("new-args-len", a.n);                 // 3
function F(){ this.s = Array.prototype.slice.call(arguments).join(","); }
p("new-args-vals", (new F(7,8)).s);     // 7,8
p("new-args-empty", (new function(){ this.n = arguments.length; }()).n); // 0
// arguments in new with spread
var b = new function(){ this.n = arguments.length; }(...[1,2,3,4]);
p("spread-args-len", b.n);              // 4
p("spread-named", (new F(...[9,10])).s);// 9,10
// bound + spread construct
var BF = F.bind(null);
p("bound-spread", (new BF(...[1,2])).s);// 1,2

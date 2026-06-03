function p(n,v){print(n+"="+v);}
function Foo(a,b){ this.a=a; this.b=b; }
var BF = Foo.bind(null, 1);
var o = new BF(2);
p("a", o.a);              // 1
p("b", o.b);              // 2
p("instanceof-target", o instanceof Foo); // true
// nested bind
var BF2 = Foo.bind(null,9).bind(null,8);
var o2 = new BF2();
p("nested-a", o2.a);      // 9
p("nested-b", o2.b);      // 8
// constructor returning an object
function Bar(){ return {z:5}; }
var BB = Bar.bind(null);
var ob = new BB();
p("return-obj", ob.z);    // 5
// native ctor bound
var AB = Array.bind(null);
var arr = new AB(1,2,3);
p("native-array", arr.length); // 3

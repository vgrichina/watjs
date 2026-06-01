function p(n,v){print(n+"="+v);}
var k="foo"; class C { get [k](){ return 42; } }
p("get", new C().foo);
var k2="bar"; class D { set [k2](v){ this._b=v; } get [k2](){ return this._b; } }
var d=new D(); d.bar=9; p("getset", d.bar);
class E { get x(){ return 1; } set x(v){ this._x=v; } }
var e=new E(); e.x=5; p("plain", e.x+":"+e._x);
var pre="data"; class F { get [pre+"X"](){ return 7; } }
p("concat-key", new F().dataX);

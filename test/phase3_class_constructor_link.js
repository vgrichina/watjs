function p(n,v){print(n+"="+v);}
class C {}
p("ctor-is-C", C.prototype.constructor === C);
p("instance-ctor", (new C()).constructor === C);
var d = Object.getOwnPropertyDescriptor(C.prototype, "constructor");
p("desc", d.writable+","+d.enumerable+","+d.configurable);
class D extends C {}
p("derived-ctor", D.prototype.constructor === D);
p("derived-instance", (new D()).constructor === D);
class E { constructor(){ this.v = 1; } m(){ return this.constructor === E; } }
p("this-constructor", (new E()).m());
p("hasOwn-constructor", C.prototype.hasOwnProperty("constructor"));
var keys=[]; for (var k in new C()) keys.push(k);
p("for-in-no-ctor", JSON.stringify(keys));

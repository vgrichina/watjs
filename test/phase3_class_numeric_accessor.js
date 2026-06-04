function p(n,v){print(n+"="+v);}
class A { get 0x10(){ return "hex"; } get 1e3(){ return "exp"; } get 5(){ return 50; } }
var a = new A();
p("hex", a[16]);          // hex
p("exp", a[1000]);        // exp
p("dec", a[5]);           // 50
p("hex-name", Object.getOwnPropertyDescriptor(A.prototype,"16").get.name);  // get 16
class B { get "str"(){ return "s"; } set "str"(v){ this._v = v; } }
var b = new B();
p("str-get", b.str);      // s
p("str-name", Object.getOwnPropertyDescriptor(B.prototype,"str").get.name);  // get str
p("on-proto", A.prototype.hasOwnProperty("16"));  // true
p("non-enum", Object.getOwnPropertyDescriptor(A.prototype,"16").enumerable); // false

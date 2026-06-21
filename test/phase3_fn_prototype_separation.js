// ordinary function: own props vs .prototype props are distinct
function F(){}
F.a = 1; F.prototype.b = 2;
if (F.a !== 1) throw "F.a";
if (F.prototype.a !== undefined) throw "F.prototype.a leak";
if (F.b !== undefined) throw "F.b leak";
if (F.prototype.b !== 2) throw "F.prototype.b";
if ("a" in F.prototype) throw "in-leak";

// class: static vs instance separation
class C {
  static sm(){ return "sm"; }
  static get sg(){ return "sg"; }
  im(){ return "im"; }
  get ig(){ return "ig"; }
  static sf = 10;
  inf = 20;
  static *sgen(){ yield 1; }
  static ["sc"](){ return "sc"; }
}
var c = new C();
if (C.sm() !== "sm") throw "static method";
if (C.sg !== "sg") throw "static getter";
if (C.sf !== 10) throw "static field";
if (C.sc() !== "sc") throw "static computed method";
if ([...C.sgen()].join() !== "1") throw "static gen method";
if (c.sm !== undefined) throw "static method leaked to instance";
if (c.sg !== undefined) throw "static getter leaked to instance";
if (c.sf !== undefined) throw "static field leaked to instance";
if (c.im() !== "im") throw "instance method";
if (c.ig !== "ig") throw "instance getter";
if (c.inf !== 20) throw "instance field";
if (C.im !== undefined) throw "instance method leaked to ctor";
if (C.ig !== undefined) throw "instance getter leaked to ctor";

// enumeration: statics are non-enumerable, not on instances
if (Object.keys(C).join() !== "sf") throw "Object.keys(C)="+Object.keys(C);
if (C.propertyIsEnumerable("sm")) throw "sm enumerable";
var names = Object.getOwnPropertyNames(C).sort().join();
if (names.indexOf("sm") < 0 || names.indexOf("sf") < 0) throw "gopn missing: "+names;

// defineProperty static on a function
function G(){}
Object.defineProperty(G, "x", {value: 5, enumerable: false});
if (G.x !== 5) throw "dp static";
if (G.prototype.x !== undefined) throw "dp leak to prototype";
var d = Object.getOwnPropertyDescriptor(G, "x");
if (!d || d.value !== 5 || d.enumerable !== false) throw "dp descriptor";

// static method descriptor on class ctor
var sd = Object.getOwnPropertyDescriptor(C, "sm");
if (!sd || typeof sd.value !== "function" || sd.enumerable !== false || sd.writable !== true || sd.configurable !== true) throw "static method descriptor wrong";

print("ok");

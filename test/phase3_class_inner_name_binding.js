// A named class has an inner immutable binding of its own name, scoped to the class body, that
// methods, static blocks, static fields, and instance-field initializers can reference — even a
// named class EXPRESSION (which has no outer binding). Anonymous classes are unaffected.

// static block referencing the class name
class A { static x; static { A.x = 42; } }
if (A.x !== 42) throw new Error("static block self-ref: " + A.x);

// static field referencing the class name
class B { static a = 1; static b = B.a + 1; }
if (B.b !== 2) throw new Error("static field self-ref: " + B.b);

// named class EXPRESSION: method references the inner name; the name does NOT leak outside
var X = class C { m() { return C; } };
if (new X().m() !== X) throw new Error("expr method self-ref");
var threw = false;
try { C; } catch (e) { threw = e instanceof ReferenceError; }
if (!threw) throw new Error("class-expression name leaked outside");

// named class expression static self-ref
var Y = class D { static v = 7; static w = D.v * 2; };
if (Y.w !== 14) throw new Error("expr static self-ref: " + Y.w);

// extends + self-ref in a method (subclass)
class Base { tag() { return "base"; } }
class Sub extends Base { tag() { return "sub-of-" + Sub.name; } }
if (new Sub().tag() !== "sub-of-Sub") throw new Error("extends self-ref");

// the inner name shadows an outer binding of the same name inside the class body
var Same = "outer";
var Z = class Same { get() { return Same; } };
if (new Z().get() !== Z) throw new Error("inner name shadow");
if (Same !== "outer") throw new Error("outer binding clobbered: " + Same);

// the class name is NOT bound during the ClassHeritage (extends) — TDZ ReferenceError
var extThrew = false;
try { (0, eval)("class E extends E {}"); } catch (e) { extThrew = e instanceof ReferenceError; }
if (!extThrew) throw new Error("class name should be TDZ in extends expression");

// instance field can reference the class name
class F { self = F; }
if (new F().self !== F) throw new Error("instance field self-ref");

print("ok");

// Methods, accessors, and static methods are non-constructors → no own .prototype.
// Constructors, generator methods, and normal/function-expression fns keep .prototype.
var o = { m() {}, get x() { return 1 }, set x(v) {} };
assert(!('prototype' in o.m), "object method has no prototype");
assert(o.m.prototype === undefined, "method.prototype is undefined");
var dx = Object.getOwnPropertyDescriptor(o, 'x');
assert(!('prototype' in dx.get), "getter has no prototype");
assert(!('prototype' in dx.set), "setter has no prototype");

class C { foo() {} static bar() {} get g() { return 1 } }
assert(!('prototype' in C.prototype.foo), "class method has no prototype");
assert(!('prototype' in C.bar), "static method has no prototype");
assert('prototype' in C, "class constructor keeps prototype");

var g = { *gen() {} };
assert('prototype' in g.gen, "generator method keeps prototype");
assert('prototype' in function () {}, "normal function keeps prototype");
assert(!('prototype' in (() => {})), "arrow has no prototype");

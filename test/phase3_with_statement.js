// `with (obj) stmt` delegates variable lookups in the body to obj's own properties.
var o = { x: 5, y: 10 };
var r;
with (o) { r = x + y; }
assert(r === 15, "with reads object properties");

with (o) { x = 99; }
assert(o.x === 99, "with writes through to the object property");

// return from inside with
function f(obj) { with (obj) { return prop; } }
assert(f({ prop: 42 }) === 42, "return from within with");

// outer bindings still visible when not shadowed by the object
var outer = 7;
with ({ a: 1 }) { assert(outer === 7, "outer binding visible"); }

// nested with
var a = { p: 1 }, b = { q: 2 }, n;
with (a) { with (b) { n = p + q; } }
assert(n === 3, "nested with");

// scope restored after the with body
var z = 3;
with (o) {}
assert(z === 3, "scope restored after with");

// assigning an unbound name inside with creates a global (sloppy), not an object prop
with ({}) { withGlobalX = 123; }
assert(typeof withGlobalX !== "undefined" && withGlobalX === 123, "unbound assign → global");

// @@unscopables hides a property from with
var u = { foo: 1 };
u[Symbol.unscopables] = { foo: true };
var foo = "outer";
with (u) { assert(foo === "outer", "@@unscopables hides the property"); }

// Bare `{pat} = RHS` in expression position (cover grammar): an object literal
// followed by `=` is reinterpreted as a destructuring-assignment pattern. Also
// covers reserved-word property names as keys (LiteralPropertyName).
var x, y = { a: x } = { a: 99 };
assert(x === 99, "bare ident-key destructure-assign");
assert(y.a === 99, "destructure-assign evaluates to RHS");

var kw, z = { void: kw } = { void: 42 };   // reserved word as property name
assert(kw === 42, "keyword property-name key");
assert(z.void === 42);

var a, b, r = { a, b } = { a: 1, b: 2 };   // shorthand
assert(a === 1 && b === 2, "shorthand bare destructure-assign");

var p, q;                                   // nested + default in bare form
({ m: { n: p } = { n: 9 }, k: q = 7 } = { k: undefined });
assert(p === 9 && q === 7, "nested/default bare destructure-assign");

// object literal NOT followed by '=' must still parse as a literal
var t = (true ? { v: 5 } : { v: 6 });
assert(t.v === 5, "ternary object literal unaffected");

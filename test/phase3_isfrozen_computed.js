// Computed isFrozen/isSealed/isExtensible (not just markers), incl. functions.
function p(n, v) { print(n + "=" + v); }

// constructors/functions are extensible → not frozen/sealed
p("Object-frozen", Object.isFrozen(Object));     // false
p("Object-sealed", Object.isSealed(Object));     // false
p("Object-ext", Object.isExtensible(Object));    // true

// a non-extensible object with no own props is frozen+sealed
var child = Object.preventExtensions(Object.create({}));
p("child-frozen", Object.isFrozen(child));       // true
p("child-sealed", Object.isSealed(child));       // true

// a non-extensible object with a writable data prop is sealed but not frozen
var o = {}; Object.defineProperty(o, "a", { value: 1, writable: true, configurable: false }); Object.preventExtensions(o);
p("o-frozen", Object.isFrozen(o));               // false (writable)
p("o-sealed", Object.isSealed(o));               // true

// freeze/seal/preventExtensions work on functions
var f = function () {}; Object.freeze(f);
p("fn-frozen", Object.isFrozen(f) + "," + Object.isExtensible(f)); // true,false
var g = function () {}; Object.seal(g);
p("fn-sealed", Object.isSealed(g) + "," + Object.isFrozen(g));     // true,false
var h = function () {};
p("fn-plain", Object.isExtensible(h) + "," + Object.isFrozen(h));  // true,false

// Function .name: declared names, inference, and anonymous → "".
function decl() {}
print("decl=" + decl.name);
print("named-expr=" + (function foo() {}).name);
print("anon-expr=[" + (function () {}).name + "]");
print("anon-arrow=[" + (() => {}).name + "]");

// inference: anonymous literal assigned to a binding takes the binding name
var a = function () {};
print("var=" + a.name);
let b = () => {};
print("let=" + b.name);
var c;
c = function () {};
print("assign=" + c.name);

// NOT inferred: a reference keeps the referent's name
var d = decl;
print("ref=" + d.name);
var e = function keep() {};
print("named-keep=" + e.name);

// object properties / methods
var o = { p: function () {}, q: () => {}, m() {}, r: decl };
print("prop=" + o.p.name);
print("prop-arrow=" + o.q.name);
print("method=" + o.m.name);
print("prop-ref=" + o.r.name);

// destructuring default
var [x = function () {}] = [];
print("dstr-default=" + x.name);
var { y = () => {} } = {};
print("dstr-obj-default=" + y.name);

// name descriptor shape
var nd = Object.getOwnPropertyDescriptor(decl, "name");
print("name-desc=" + nd.value + "," + nd.writable + "," + nd.enumerable + "," + nd.configurable);

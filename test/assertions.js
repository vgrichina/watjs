// QuickJS-style: self-checking via assert(); pass = no uncaught throw.

// arithmetic & precedence
assert(1 + 2 * 3 === 7, "precedence");
assert((1 + 2) * 3 === 9, "parens");
assert(10 % 3 === 1, "modulo");
assert(-(-5) === 5, "double negate");

// strings
assert("foo" + "bar" === "foobar", "concat");
assert("abc".length === 3, "str length");
assert("hello"[1] === "e", "str index");

// comparison & equality
assert(1 < 2 && 2 <= 2 && 3 > 2 && 3 >= 3, "relational");
assert(1 == "1", "loose eq");
assert(1 !== "1", "strict neq");
assert(null == undefined, "null/undefined");
assert(NaN !== NaN, "NaN");

// logical & ternary
assert((true && 5) === 5, "and value");
assert((false || 7) === 7, "or value");
assert((2 > 1 ? "y" : "n") === "y", "ternary");

// variables & scope
var x = 10; x += 5; assert(x === 15, "compound");
{ var y = 1; assert(y === 1, "block"); }

// control flow
var s = 0;
for (var i = 1; i <= 100; i++) s += i;
assert(s === 5050, "for sum");
var n = 0, c = 0;
while (n < 10) { n++; c += n; }
assert(c === 55, "while");

// functions, recursion, closures
function fact(n) { return n <= 1 ? 1 : n * fact(n - 1); }
assert(fact(6) === 720, "factorial");
function adder(a) { return function (b) { return a + b; }; }
assert(adder(3)(4) === 7, "closure");
function counter() { var k = 0; return function () { return ++k; }; }
var ct = counter();
assert(ct() === 1 && ct() === 2 && ct() === 3, "stateful closure");

// exceptions
var caught = false;
try { throw "e"; } catch (e) { caught = (e === "e"); }
assert(caught, "try/catch");

// objects & arrays
var o = { a: 1, b: { c: 2 } };
o.a = 5; o.b.c = 9;
assert(o.a === 5 && o.b.c === 9, "nested object");
var arr = [1, 2, 3];
arr[arr.length] = 4;
var total = 0;
for (var j = 0; j < arr.length; j++) total += arr[j];
assert(arr.length === 4 && total === 10, "array");

print("ALL ASSERTIONS PASSED");

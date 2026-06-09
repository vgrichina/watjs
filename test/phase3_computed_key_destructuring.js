// Object destructuring with computed property keys { [expr]: target }.
var k = "a";
var { [k]: x } = { a: 42 };
if (x !== 42) throw "computed read: " + x;
// key expression is evaluated (in order), and errors propagate
var order = [];
var { [(order.push("k"), "b")]: y } = { b: 7 };
if (order.join(",") !== "k" || y !== 7) throw "eval-order: " + order + "/" + y;
function te(fn){ try { fn(); return false; } catch(e){ return e instanceof Error; } }
if (!te(function(){ var { [(function(){ throw new Error("e"); })()]: z } = {}; })) throw "key-error must propagate";
// default with computed key
var { [k]: d = 99 } = {};
if (d !== 99) throw "computed default: " + d;
// nested pattern under computed key
var { [k]: {n} } = { a: { n: 5 } };
if (n !== 5) throw "computed nested: " + n;
// assignment form to a simple binding
var w; ({ [k]: w } = { a: 8 });
if (w !== 8) throw "computed assign: " + w;
// mixed with normal keys
var { p, [k]: q } = { p: 1, a: 2 };
if (p !== 1 || q !== 2) throw "mixed: " + p + "/" + q;
print("ok");

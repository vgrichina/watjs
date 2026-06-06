// Array length [[DefineOwnProperty]] invariants (ArraySetLength).
function p(n, v) { print(n + "=" + v); }

// length made non-writable: a value change via defineProperty throws TypeError
var a = [];
Object.defineProperty(a, "length", { writable: false });
var e1 = false; try { Object.defineProperty(a, "length", { value: 12 }); } catch (e) { e1 = e.constructor.name === "TypeError"; }
p("nw-value", e1);

// adding an index at/after length when length is non-writable throws
var b = [1, 2, 3];
Object.defineProperty(b, "length", { writable: false });
var e2 = false; try { Object.defineProperty(b, 3, { value: "x" }); } catch (e) { e2 = e.constructor.name === "TypeError"; }
p("nw-index", e2);

// plain length assignment is ignored when length is non-writable
b.length = 9;
p("nw-assign", b.length); // 3

// defineProperty shrink deletes the truncated elements
var c = [1, 2, 3, 4, 5];
Object.defineProperty(c, "length", { value: 2 });
p("shrink", c.length + "," + c[2]); // 2,undefined

// shrink blocked by a non-configurable index: throws, length stops at idx+1
var d = [1, 2, 3, 4];
Object.defineProperty(d, "2", { value: 99, configurable: false });
var e3 = false; try { Object.defineProperty(d, "length", { value: 0 }); } catch (e) { e3 = e.constructor.name === "TypeError"; }
p("shrink-nc", e3 + "," + d.length); // true,3

// ToUint32 RangeError takes precedence over invariant TypeErrors
var f = [];
Object.defineProperty(f, "length", { writable: false });
var e4 = ""; try { Object.defineProperty(f, "length", { value: -1, configurable: true }); } catch (e) { e4 = e.constructor.name; }
p("range-first", e4); // RangeError

// normal length resize still works
var g = [1, 2, 3];
g.length = 1;
p("normal", g.length + "," + g.join(",")); // 1,1

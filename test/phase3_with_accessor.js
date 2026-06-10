// Variable access inside `with (obj)` must go through obj's [[Get]]/[[Set]] (invoking
// getters/setters), not read/write a raw scope slot (which was wrong for accessors and
// crashed when a getter mutated the object mid-expression).
var log = [];

// getter on read
var o1 = { get x() { log.push('g'); return 42; } };
with (o1) { if (x !== 42) throw new Error("getter read: " + x); }

// getter + setter on compound assignment
var o2 = { get y() { log.push('gy'); return 10; }, set y(v) { log.push('sy' + v); } };
with (o2) { y += 5; }            // get 10, +5 => 15, set 15
if (log.indexOf('gy') < 0 || log.indexOf('sy15') < 0) throw new Error("accessor compound: " + log);

// setter on plain assignment
var setVal;
var o3 = { set z(v) { setVal = v; } };
with (o3) { z = 99; }
if (setVal !== 99) throw new Error("setter plain assign: " + setVal);

// plain data property still works (no regression): read, compound, assign
var o4 = { a: 1, b: 2 };
with (o4) { a *= 3; b = 7; }
if (o4.a !== 3) throw new Error("data compound: " + o4.a);
if (o4.b !== 7) throw new Error("data assign: " + o4.b);

// a getter that deletes its own property mid-access must NOT crash (OOB)
var o5 = { get w() { delete this.w; return 2; } };
var crashed = false;
try { with (o5) { w *= 3; } } catch (e) { crashed = true; }
if (crashed) throw new Error("self-deleting getter should not throw/crash");

// names not on the with-object fall through to the enclosing scope
var outer = 5;
var o6 = { other: 1 };
with (o6) { outer = outer + 1; }
if (outer !== 6) throw new Error("fall-through to outer scope: " + outer);

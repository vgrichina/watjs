// A labeled break/continue that jumps out of enclosing try/finally, for-of loops, or with
// statements must run those finally blocks, close those iterators, and pop those scopes on the
// way out (like a plain break/continue does). Previously labeled break/continue skipped all of it.

// labeled break runs the enclosing finally
var ran = 0;
outer: for (var i = 0; i < 2; i++) { try { break outer; } finally { ran = 1; } }
if (ran !== 1) throw new Error("labeled break skipped finally");

// labeled continue runs the finally each iteration
var n = 0;
L1: for (var i = 0; i < 3; i++) { try { continue L1; } finally { n++; } }
if (n !== 3) throw new Error("labeled continue finally count: " + n);

// labeled break closes an inner for-of iterator
var closed = false;
var iterable = { [Symbol.iterator]() { return { next() { return { value: 1, done: false }; }, return() { closed = true; return {}; } }; } };
L2: for (var k = 0; k < 1; k++) { for (var v of iterable) { break L2; } }
if (!closed) throw new Error("labeled break did not close the iterator");

// nested finallys run innermost-first
var order = "";
L3: for (var i = 0; i < 2; i++) { try { try { break L3; } finally { order += "a"; } } finally { order += "b"; } }
if (order !== "ab") throw new Error("nested finally order: " + order);

// labeled break out of a `with` pops the with-scope (sloppy mode)
var w = (0, eval)("var o = { a: 1 }; W: for (var i = 0; i < 2; i++) { with (o) { break W; } } typeof a;");
if (w !== "undefined") throw new Error("with-scope leaked after labeled break: " + w);

// plain labeled break still works (no cleanup to run)
var m = 0;
P: for (var i = 0; i < 5; i++) { if (i === 2) break P; m++; }
if (m !== 2) throw new Error("plain labeled break: " + m);

print("ok");

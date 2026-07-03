// Prefix ++/-- on a MEMBER or INDEX target (`++obj.key`, `--obj[i]`) previously
// mis-compiled: only a bare identifier was handled, so `.key` was parsed as a
// separate bare variable ("counter is not defined"). Result is the NEW value.
var o = { counter: 5 };
if (++o.counter !== 6 || o.counter !== 6) throw new Error("++obj.key: " + o.counter);
if (--o.counter !== 5 || o.counter !== 5) throw new Error("--obj.key: " + o.counter);

// inside an object literal (the deepEqual.js case: { id: ++seen.counter })
var u = { id: ++o.counter };
if (u.id !== 6 || o.counter !== 6) throw new Error("++ in object literal: " + u.id);

// index target, with a computed index expression
var arr = [10, 20, 30];
if (++arr[0 + 1] !== 21 || arr[1] !== 21) throw new Error("++arr[expr]: " + arr[1]);
if (--arr[2] !== 29 || arr[2] !== 29) throw new Error("--arr[i]: " + arr[2]);

// chained member access — RMW applies to the LAST access only
var a = { b: { c: 1 } };
if (++a.b.c !== 2 || a.b.c !== 2) throw new Error("++a.b.c: " + a.b.c);

// mixed member then index
var m = { list: [7] };
if (++m.list[0] !== 8 || m.list[0] !== 8) throw new Error("++m.list[0]: " + m.list[0]);

// BigInt-aware (INC must preserve BigInt, not coerce to Number)
var big = { v: 5n };
if (++big.v !== 6n) throw new Error("++obj.bigint");

// bare identifier still works (fast path unchanged)
var y = 0;
if (++y !== 1 || y !== 1) throw new Error("bare ++y");

print("ok");

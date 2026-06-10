// Generator .next/.return/.throw on a foreign `this` → TypeError (not a trap from
// reading @@ctx off a non-generator).
var it = (function* () { yield 1; })();
function throwsType(f) { try { f(); return false; } catch (e) { return e instanceof TypeError; } }
assert(throwsType(function () { it.next.call(3); }), "next on number");
assert(throwsType(function () { it.return.call({}, 1); }), "return on object");
assert(throwsType(function () { it.throw.call(null, 1); }), "throw on null");
// normal generator methods still work
var g = (function* () { yield 10; yield 20; })();
assert(g.next().value === 10, "next 1");
assert(g.next().value === 20, "next 2");
var r = g.return(99);
assert(r.value === 99 && r.done === true, "return value/done");

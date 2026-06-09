// A for-of/for-in head with no var/let/const is an assignment pattern: ident
// targets ASSIGN (strict → ReferenceError if undeclared), not define.
var x; for ([ x ] of [[5],[6]]) {} assert(x === 6, "assign-pattern binds existing var");
var o = {}; for ([ o.p ] of [[1],[2]]) {} assert(o.p === 2, "member target in for-of head");
var seen = []; for ({a: x} of [{a:1},{a:2}]) seen.push(x); assert(seen.length===2 && x===2, "obj assign-pattern");
// strict + undeclared target → ReferenceError, loop body never runs
var threw = false, ran = 0;
try { (function(){ "use strict"; for ([ undeclaredXYZ ] of [[]]) ran++; })(); }
catch (e) { threw = e instanceof ReferenceError; }
assert(threw, "strict undeclared assignment target throws ReferenceError");
assert(ran === 0, "loop body did not run");
// declaration head still binds (does NOT throw)
for (let [k] of [[9]]) assert(k === 9, "let binding head still works");

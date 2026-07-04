// Block-level lexical scoping: a `{ … }` block containing a top-level let/const/class gets its own
// scope, so those bindings shadow (not clobber) the enclosing scope and don't leak out. `var` still
// hoists past the block to the function/var scope. Closures capture the live block binding.

// inner let shadows outer; outer restored after the block
let x = 1;
{ let x = 2; if (x !== 2) throw new Error("inner shadow: " + x); }
if (x !== 1) throw new Error("outer clobbered: " + x);

// nested blocks each shadow
{ let y = "a"; { let y = "b"; { let y = "c"; if (y !== "c") throw new Error(y); } if (y !== "b") throw new Error(y); } if (y !== "a") throw new Error(y); }

// a block-scoped let does not leak out
{ let hidden = 5; }
var leaked = false; try { hidden; leaked = true; } catch (e) {}
if (leaked) throw new Error("block let leaked");

// const in a block, same semantics
const c = 1;
{ const c = 2; if (c !== 2) throw new Error("const shadow"); }
if (c !== 1) throw new Error("const outer clobbered");

// var hoists OUT of a lexical block to the function/var scope
function varHoist() { { var v = 9; let l = 1; } return typeof v + "," + (typeof l); }
if (varHoist() !== "number,undefined") throw new Error("var/let hoisting: " + varHoist());

// two sibling blocks get independent bindings (closures don't share)
var f0, f1;
{ let a = 1; f0 = function () { return a; }; }
{ let a = 2; f1 = function () { return a; }; }
if (f0() !== 1 || f1() !== 2) throw new Error("sibling blocks share: " + f0() + "," + f1());

// a hoisted inner function declaration sees the function body's let/const (body is NOT an extra scope)
function bodyScope() { const self = 42; function inner() { return self; } return inner(); }
if (bodyScope() !== 42) throw new Error("function-body let not visible to hoisted inner fn");

// break out of a lexical block pops its scope (no leak)
for (var i = 0; i < 3; i++) { { let z = i; if (z === 1) break; } }
var zLeaked = false; try { z; zLeaked = true; } catch (e) {}
if (zLeaked) throw new Error("break-out-of-block leaked its let");

// if/else block bodies are lexical
if (true) { let w = 7; if (w !== 7) throw new Error(w); }
var wLeaked = false; try { w; wLeaked = true; } catch (e) {}
if (wLeaked) throw new Error("if-block let leaked");

// a plain block with no lexical declarations still works (no scope pushed)
var r = 0; { r = 5; } if (r !== 5) throw new Error("plain block: " + r);

print("ok");

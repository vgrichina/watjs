// AnnexB B.3.3: a `function` declaration in an IfStatement/loop single-statement clause
// position (`if(x) function f(){}`, `if(x); else function f(){}`) creates a VAR/global binding
// for the name initialized to `undefined` at instantiation; the function value is assigned only
// when the declaration is reached at runtime.

// global-scope clause fn: binding exists (undefined) before the declaration executes
if (typeof gf !== "undefined") throw new Error("gf should be hoisted as undefined");
if (false) ; else function gf() {}
if (typeof gf !== "function") throw new Error("gf should be a function after else-clause runs");

// function-scope: binding is initialized to undefined, mutable, and the outer `f` reference
// after the IIFE is not created (var-scoped to the function)
var init, changed;
(function () {
  init = f;              // hoisted var binding = undefined
  f = 123;
  changed = f;           // mutable
  if (false) ; else function f() {}
})();
if (init !== undefined) throw new Error("init should be undefined, got " + init);
if (changed !== 123) throw new Error("changed should be 123, got " + changed);
var leaked = false;
try { f; leaked = true; } catch (e) {}
if (leaked) throw new Error("f must not leak to the enclosing scope");

// an existing real declaration is NOT re-initialized by a sibling clause declaration:
// `init2 = f` must see the plain `function f` (outer), not undefined
var init2;
(function () {
  init2 = f;
  if (false) ; else function f() { return "inner"; }
  function f() { return "outer"; }
})();
if (init2() !== "outer") throw new Error("existing decl clobbered: " + init2());

// if-consequent clause form
function g() {
  var seen = h;                       // hoisted undefined
  if (true) function h() { return 7; }
  return [seen, h()];
}
var r = g();
if (r[0] !== undefined || r[1] !== 7) throw new Error("if-consequent clause: " + r);

// suppression: a lexical binding of the same name in an enclosing block means the var
// binding must NOT be created (would be an early error) — f stays a ReferenceError globally
{
  let bf = 123;
  if (true) function bf() {}
}
var sup = false;
try { bf; sup = true; } catch (e) {}
if (sup) throw new Error("block-lexical conflict must suppress the global binding");

print("ok");

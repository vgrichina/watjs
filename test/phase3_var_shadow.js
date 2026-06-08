// `var/let NAME = init` must declare a LOCAL binding (shadowing an outer/global
// of the same name), not assign up the scope chain. Regression for a bug where
// `var x = e` clobbered an outer `x` (broke the test262 compareArray harness).
var x = "global-x";
function f(){ var x = "local-x"; return x; }
if (f() !== "local-x") throw "f local wrong";
if (x !== "global-x") throw "var-with-init clobbered outer x: " + x;

let y = "global-y";
function g(){ let y = "local-y"; return y; }
if (g() !== "local-y") throw "g local wrong";
if (y !== "global-y") throw "let-with-init clobbered outer y: " + y;

// bare `var z;` then assign was already correct — keep it working
var z = "global-z";
function h(){ var z; z = 42; return z; }
if (h() !== 42) throw "h local wrong";
if (z !== "global-z") throw "bare var clobbered outer z: " + z;

// sloppy assignment WITHOUT a declaration still writes the outer/global (legit)
var w = 1;
function k(){ w = 2; }
k();
if (w !== 2) throw "undeclared assign should reach global w: " + w;

// the harness pattern that this bug broke: a function-local `var result`
function compareArray(a, b){ var result = (a.length === b.length); return result; }
var result = { a: 1, b: 2 };
compareArray([1,2,3], [1,2,3]);
if (typeof result !== "object" || result.a !== 1) throw "global object clobbered by inner var result";
print("ok");

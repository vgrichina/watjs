// An object destructuring pattern performs RequireObjectCoercible on the source
// even when the pattern is empty — null/undefined → TypeError.
function te(fn){ try { fn(); return false; } catch(e){ return e instanceof TypeError; } }
if (!te(function(){ var {} = null; })) throw "var {} = null";
if (!te(function(){ var {} = undefined; })) throw "var {} = undefined";
if (!te(function(){ var {x} = null; })) throw "var {x} = null";
if (!te(function(){ ({} = null); })) throw "({} = null)";
if (!te(function(){ ({a} = undefined); })) throw "({a} = undefined)";
if (!te(function(){ let {} = null; })) throw "let {} = null";
if (!te(function(){ (function({}){})(null); })) throw "param {} = null";
// valid object destructuring still works
var {a, b} = {a: 1, b: 2}; if (a !== 1 || b !== 2) throw "valid";
var {} = {}; var {} = 0; var {} = "s"; var {} = true;  // coercible primitives are fine (no throw)
var {p = 7} = {}; if (p !== 7) throw "default";
print("ok");

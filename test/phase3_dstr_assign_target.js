// Destructuring ASSIGNMENT to an identifier target assigns (up the chain) — it does
// NOT define a new local. In strict mode an undeclared target throws ReferenceError;
// in sloppy mode it creates a global. Binding destructuring (var/let/const) still defines.
function te(fn){ try { fn(); return false; } catch(e){ return e instanceof ReferenceError; } }
if (!te(function(){ 'use strict'; [undeclaredA] = [1]; })) throw "array strict undeclared";
if (!te(function(){ 'use strict'; ({x: undeclaredB} = {x:1}); })) throw "object strict undeclared";
if (!te(function(){ 'use strict'; var z; [z, undeclaredC] = [1, 2]; })) throw "mixed strict";
// declared targets assign (don't shadow)
var p = 1; [p] = [9]; if (p !== 9) throw "assign existing array";
var q = {}; var r = 1; ({a: r} = {a: 7}); if (r !== 7) throw "assign existing object";
// sloppy undeclared → global (no throw)
(function(){ [sloppyGlobalX] = [5]; })(); if (typeof sloppyGlobalX === "undefined") throw "sloppy global";
// binding destructuring still defines locals
var [m, n] = [1, 2]; if (m !== 1 || n !== 2) throw "binding";
var {j} = {j: 3}; if (j !== 3) throw "obj binding";
print("ok");

// IteratorClose on normal/break completion: GetMethod(return) not-callable → TypeError;
// return() that yields a non-object → TypeError; throw-completion suppresses both.
function te(fn){ try { fn(); return false; } catch(e){ return e instanceof TypeError; } }
function iter(ret){ var it={next:function(){return {done:false,value:1};},return:ret}; var ib={}; ib[Symbol.iterator]=function(){return it;}; return ib; }

// destructuring (normal close because pattern shorter than iterator)
if (!te(function(){ var [a] = iter(function(){ return null; }); })) throw "null return must throw";
if (!te(function(){ var [a] = iter(5); })) throw "non-callable return must throw";
if (te(function(){ var [a] = iter(function(){ return {}; }); })) throw "object return must not throw";
// undefined/absent return → no close, no throw
if (te(function(){ var [a] = iter(undefined); })) throw "undefined return must not throw";

// for-of break: same normal-close semantics
if (!te(function(){ for (var x of iter(function(){ return null; })) break; })) throw "for-of break null return must throw";
// for-of throw: original error wins, return's bad result suppressed
var orig = false;
try { for (var y of iter(function(){ return null; })) { throw new RangeError("orig"); } }
catch(e){ orig = e instanceof RangeError; }
if (!orig) throw "throw-completion must preserve original error";
print("ok");

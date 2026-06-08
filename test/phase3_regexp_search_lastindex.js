// RegExp.prototype[@@search]: Set(rx,"lastIndex",..,true) — a throwing setter
// propagates; a getter-only (no setter) lastIndex throws TypeError; the previous
// lastIndex is restored afterward (also via a throwing Set).
var calls = 0;
var poisoned = { get lastIndex(){ calls++; }, set lastIndex(_){ throw new RangeError("set!"); } };
var t1 = false; try { RegExp.prototype[Symbol.search].call(poisoned); } catch(e){ t1 = e instanceof RangeError; }
if (!t1) throw "throwing setter must propagate";
if (calls !== 1) throw "lastIndex read once before set";
var getterOnly = { get lastIndex(){ return 5; }, exec: function(){ return null; } };
var t2 = false; try { RegExp.prototype[Symbol.search].call(getterOnly); } catch(e){ t2 = e instanceof TypeError; }
if (!t2) throw "setter-less lastIndex must throw TypeError";
// normal search still works
if ("hello world".search(/world/) !== 6) throw "normal search";
if ("abc".search(/x/) !== -1) throw "no-match search";
// @@match global empty-match advance also Sets lastIndex with Throw=true
if ("aXbXc".match(/X/g).join(",") !== "X,X") throw "global match";
if ("a".match(/(?:)/g).join(",") !== ",") throw "empty global match";  // ["",""]
print("ok");

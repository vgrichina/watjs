// Symbol.for / Symbol.keyFor: .length is 1; Symbol.for(aSymbol) throws TypeError
// (ToString of a Symbol throws); a throwing toString propagates.
if (Symbol.for.length !== 1) throw "Symbol.for.length";
if (Symbol.keyFor.length !== 1) throw "Symbol.keyFor.length";
var t1 = false; try { Symbol.for(Symbol("s")); } catch(e){ t1 = e instanceof TypeError; }
if (!t1) throw "Symbol.for(symbol) must throw TypeError";
var t2 = false; try { Symbol.for({ toString: function(){ throw new RangeError("x"); } }); } catch(e){ t2 = e instanceof RangeError; }
if (!t2) throw "throwing toString must propagate";
// normal behavior: same key → same registered symbol; keyFor round-trips
var s = Symbol.for("k");
if (Symbol.for("k") !== s) throw "registry identity";
if (Symbol.keyFor(s) !== "k") throw "keyFor";
if (Symbol.keyFor(Symbol("local")) !== undefined) throw "keyFor non-registered";
print("ok");

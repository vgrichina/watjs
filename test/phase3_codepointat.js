// String.prototype.codePointAt: out-of-range position returns undefined (NOT NaN
// like charCodeAt); in-range returns the code unit (full surrogate decode is future).
if ("abc".codePointAt(0) !== 97) throw "0";
if ("abc".codePointAt(2) !== 99) throw "2";
if ("abc".codePointAt(-1) !== undefined) throw "neg";
if ("abc".codePointAt(3) !== undefined) throw "==len";
if ("abc".codePointAt(100) !== undefined) throw ">len";
if (!Number.isNaN("a".charCodeAt(5))) throw "charCodeAt still NaN oob";  // unchanged
if ("abc".codePointAt.length !== 1) throw "length";
// object-coercible receiver guard
var t=false; try { String.prototype.codePointAt.call(null, 0); } catch(e){ t = e instanceof TypeError; }
if (!t) throw "null this must throw";
print("ok");

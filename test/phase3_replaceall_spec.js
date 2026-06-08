// String.prototype.replaceAll spec prologue: IsRegExp(@@match) + flags 'g' check +
// GetMethod(@@replace) with the ORIGINAL (unstringified) this passed to the replacer.
// A primitive searchValue skips @@replace entirely (no poisoned-getter access).

// 1. custom @@replace on a regex receives this=searchValue, O=original this (object)
var re = /./g, gotThis, gotO, gotRepl;
var O = { toString(){ return "OBJ"; } };
Object.defineProperty(re, Symbol.replace, { value: function(o, r){ gotThis=this; gotO=o; gotRepl=r; return 42; } });
var out = String.prototype.replaceAll.call(O, re, "R");
if (out !== 42) throw "delegate return: "+out;
if (gotThis !== re) throw "this != searchValue";
if (gotO !== O) throw "O was stringified";
if (gotRepl !== "R") throw "replaceValue";

// 2. non-global regex without override → TypeError
var threw = false;
try { "abc".replaceAll(/b/, "X"); } catch(e){ threw = e instanceof TypeError; }
if (!threw) throw "non-global regex must throw TypeError";

// 3. primitive string searchValue must NOT touch String.prototype[@@replace]
Object.defineProperty(String.prototype, Symbol.replace, { configurable:true, get(){ throw new Error("should not be called"); } });
if ("a,b,c".replaceAll(",", "X") !== "aXbXc") throw "primitive search";
delete String.prototype[Symbol.replace];

// 4. plain object with @@match:true and bad flags → TypeError (RequireObjectCoercible)
threw = false;
try { "x".replaceAll({ [Symbol.match]: true, flags: undefined }, ""); } catch(e){ threw = e instanceof TypeError; }
if (!threw) throw "null flags must throw";
print("ok");

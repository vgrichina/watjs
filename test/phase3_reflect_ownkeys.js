// Reflect.ownKeys returns ALL own keys: integer indices (ascending), then string
// keys (insertion), then symbol keys — getOwnPropertyNames ++ getOwnPropertySymbols.
var o = {}; o.x = 1; o[Symbol("a")] = 2; o[2] = 3; o.y = 4; o[Symbol("b")] = 5; o[0] = 6;
var k = Reflect.ownKeys(o);
if (k.length !== 6) throw "length: " + k.length;
var strs = k.filter(function(v){ return typeof v === "string"; });
if (strs.join(",") !== "0,2,x,y") throw "string order: " + strs;  // indices first (asc), then strings
var syms = k.filter(function(v){ return typeof v === "symbol"; });
if (syms.length !== 2) throw "symbol count: " + syms.length;
// symbols come after all strings
if (typeof k[k.length-1] !== "symbol" || typeof k[k.length-2] !== "symbol") throw "symbols last";
// no symbol appears before a string key
var seenSym = false;
for (var i = 0; i < k.length; i++) { if (typeof k[i] === "symbol") seenSym = true; else if (seenSym) throw "string after symbol"; }
print("ok");

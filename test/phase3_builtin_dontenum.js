// Built-in prototype methods are DontEnum (spec) — for-in must not leak them, and
// getOwnPropertyDescriptor must report enumerable:false. Regressions exposed once
// for-in started walking the prototype chain.
function keys(o){var k=[];for(var p in o)k.push(p);return k.join(",");}
if (keys(/x/) !== "") throw "regex for-in leaks: "+keys(/x/);
if (Object.getOwnPropertyDescriptor(RegExp.prototype,"exec").enumerable !== false) throw "exec enumerable";
if (Object.getOwnPropertyDescriptor(RegExp.prototype,"test").enumerable !== false) throw "test enumerable";
function* g(){ yield 1; }
var it = g();
if (keys(it) !== "") throw "generator for-in leaks: "+keys(it);
// functionality intact
if (!/ab/.test("xaby")) throw "regex test broken";
if (it.next().value !== 1) throw "generator next broken";
print("ok");

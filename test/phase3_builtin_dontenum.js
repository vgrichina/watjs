// Built-in prototype methods / internal instance props are DontEnum (spec) —
// for-in must not leak them. Exposed once for-in walks the prototype chain.
function keys(o){var k=[];for(var p in o)k.push(p);return k.join(",");}
if (keys(/x/) !== "") throw "regex for-in leaks: "+keys(/x/);
if (Object.getOwnPropertyDescriptor(RegExp.prototype,"exec").enumerable !== false) throw "exec enumerable";
function* g(){ yield 1; }
if (keys(g()) !== "") throw "generator for-in leaks: "+keys(g());
// TypedArray integer indices ARE enumerable own properties (spec) — for-in must yield exactly
// the indices "0,1" and NOT leak the internal @@taelem/@@tabuf/@@talen markers.
if (keys(new Int8Array(2)) !== "0,1") throw "typedarray for-in wrong: "+keys(new Int8Array(2));
if (keys([1,2].entries()) !== "") throw "array-iterator for-in leaks";
if (keys(new Map([[1,2]]).keys()) !== "") throw "map-iterator for-in leaks";
if (keys("ab"[Symbol.iterator]()) !== "") throw "string-iterator for-in leaks";
// functionality intact
if (!/ab/.test("xaby")) throw "regex test broken";
if (g().next().value !== 1) throw "generator next broken";
var t = new Int8Array([5,6]);
if (t.length !== 2 || t.byteLength !== 2 || t.BYTES_PER_ELEMENT !== 1) throw "TA props broken";
if ([...[7,8].entries()].length !== 2) throw "iterator broken";
print("ok");

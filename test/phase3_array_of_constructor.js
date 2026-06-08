// Array.of(...items): uses `this` as a constructor when it's a custom constructor,
// else creates a plain Array. CreateDataProperty for each item + Set length.
if (JSON.stringify(Array.of(1, 2, 3)) !== "[1,2,3]") throw new Error("plain");
if (Array.of().length !== 0) throw new Error("empty");
if (!Array.isArray(Array.of(5))) throw new Error("isArray");
// custom constructor receives length and gets the items + length set on it
function MyArr(len) { this.len = len; }
var r = Array.of.call(MyArr, "a", "b");
if (r.len !== 2 || r[0] !== "a" || r[1] !== "b" || r.length !== 2) throw new Error("custom ctor");
// a throwing constructor propagates
function Boom() { throw new TypeError("boom"); }
var threw = false; try { Array.of.call(Boom, 1); } catch (e) { threw = e instanceof TypeError; }
if (!threw) throw new Error("throwing ctor");
print("ok");

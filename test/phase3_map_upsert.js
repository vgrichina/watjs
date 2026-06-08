// Map.prototype.getOrInsert / getOrInsertComputed (the "upsert" proposal).
var m = new Map([["a", 1]]);
if (m.getOrInsert("a", 99) !== 1) throw "existing key returns value";
if (m.getOrInsert("b", 2) !== 2) throw "absent key inserts+returns";
if (m.get("b") !== 2) throw "inserted";
if (m.getOrInsertComputed("c", function(k){ return k + "!"; }) !== "c!") throw "computed insert";
if (m.get("c") !== "c!") throw "computed stored";
var called = false;
if (m.getOrInsertComputed("a", function(){ called = true; return 0; }) !== 1) throw "computed existing";
if (called) throw "callback must not run for existing key";
if (m.size !== 3) throw "size";
// -0 key normalizes to +0
var m2 = new Map(); m2.getOrInsert(-0, "z");
if (Object.is([...m2.keys()][0], -0)) throw "-0 key must normalize to +0";
// non-callable callback throws TypeError (before lookup)
var threw = false; try { m.getOrInsertComputed("x", 5); } catch(e){ threw = e instanceof TypeError; }
if (!threw) throw "non-callable callbackfn must throw";
if (m.has("x")) throw "must not insert when callback invalid";
// length / non-enumerable
if (Map.prototype.getOrInsert.length !== 2) throw "length";
if (Object.getOwnPropertyDescriptor(Map.prototype, "getOrInsert").enumerable !== false) throw "enumerable";
print("ok");

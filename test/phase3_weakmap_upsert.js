// WeakMap.prototype.getOrInsert / getOrInsertComputed (upsert proposal).
var k1 = {}, k2 = {}, k3 = {}, called = false;
var w = new WeakMap([[k1, 1]]);
if (w.getOrInsert(k1, 99) !== 1) throw "existing";
if (w.getOrInsert(k2, 2) !== 2) throw "insert";
if (w.get(k2) !== 2) throw "stored";
if (w.getOrInsertComputed(k3, function(k){ return 7; }) !== 7) throw "computed";
if (!w.has(k3)) throw "computed stored";
if (w.getOrInsertComputed(k1, function(){ called = true; return 0; }) !== 1) throw "computed existing";
if (called) throw "callback must not run for existing key";
// a non-weakly-holdable key (primitive) throws TypeError
var t1 = false; try { w.getOrInsert(5, 1); } catch(e){ t1 = e instanceof TypeError; }
if (!t1) throw "primitive key must throw";
// key-validity is checked BEFORE the callable check
var t2 = false; try { w.getOrInsertComputed(5, 5); } catch(e){ t2 = e instanceof TypeError; }
if (!t2) throw "primitive key + bad callback must throw (key first)";
if (WeakMap.prototype.getOrInsert.length !== 2) throw "length";
print("ok");

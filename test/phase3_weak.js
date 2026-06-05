// WeakMap / WeakSet (strong-ref implementation; GC weakness unobservable)
var k1={}, k2={}, fn=function(){};
var wm = new WeakMap();
print(wm.set(k1, 5) === wm);
print(wm.get(k1));
print(wm.has(k1));
print(wm.has(k2));
wm.set(k1, 9); print(wm.get(k1));
print(wm.delete(k1));
print(wm.has(k1));
var ws = new WeakSet([k1, k2]);
print(ws.has(k1));
print(ws.add(fn) === ws);
print(ws.has(fn));
print(ws.delete(k1));
print(ws.has(k1));
function thr(fn2){try{fn2();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ wm.set(1, 1); }));
print(thr(function(){ ws.add("x"); }));
print(thr(function(){ new WeakMap([1,2]); }));
print(wm.get(5));   // undefined, no throw
print(ws.has(5));   // false, no throw
print(WeakMap.prototype.set.length);
print(WeakSet.prototype.add.length);
var sym = Symbol();
print(wm.set(sym, 7).get(sym));   // symbols are weakly holdable -> 7
print(thr(function(){ WeakMap.prototype.set.call(new Set(), k1, 1); })); // brand check
print(thr(function(){ WeakMap.prototype.get.call(0, k1); }));
// construct from iterable
var wm2 = new WeakMap([[k1,1],[k2,2]]);
print(wm2.get(k1)+","+wm2.get(k2));

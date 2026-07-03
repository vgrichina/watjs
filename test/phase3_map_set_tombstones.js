// Map/Set delete/clear now leave TOMBSTONES in place (spec "Map/Set Data" list) instead of
// compacting, so live iterators keep valid cursors and observe deletions/additions.

// size/has/get after delete
var m = new Map([['a', 1], ['b', 2], ['c', 3]]);
m.delete('b');
if (m.size !== 2) throw new Error("size after delete: " + m.size);
if (m.has('b')) throw new Error("has deleted");
if (m.get('a') !== 1 || m.get('c') !== 3) throw new Error("get after delete");
if ([...m.keys()].join(',') !== 'a,c') throw new Error("keys skip tombstone: " + [...m.keys()]);
if (JSON.stringify([...m]) !== '[["a",1],["c",3]]') throw new Error("entries skip tombstone");

// searching for `undefined` must NOT match a tombstone slot (arr_get normalizes holes)
if (m.has(undefined)) throw new Error("has(undefined) matched a tombstone");

// delete during iteration — the deleted key is skipped
var m2 = new Map([['x', 1], ['y', 2], ['z', 3]]);
var it = m2.entries();
it.next();            // x
m2.delete('y');
if (it.next().value[0] !== 'z') throw new Error("delete during iteration");

// clear during iteration — the live iterator becomes done
var m3 = new Map([['p', 1], ['q', 2]]);
var it3 = m3.values();
m3.clear();
var r = it3.next();
if (r.done !== true || r.value !== undefined) throw new Error("clear during iteration");

// add during iteration is visited; done is sticky
var s = new Set([1]);
var sit = s.values();
if (sit.next().value !== 1) throw new Error("set values 1");
s.add(2);
if (sit.next().value !== 2) throw new Error("add during iteration");
if (sit.next().done !== true) throw new Error("done after 2");
s.add(3);
if (sit.next().done !== true) throw new Error("done stays sticky after add");

// re-adding a deleted key appends at the end (new record)
var m4 = new Map([['a', 1], ['b', 2]]);
m4.delete('a');
m4.set('a', 10);
if ([...m4.keys()].join(',') !== 'b,a') throw new Error("re-add order: " + [...m4.keys()]);

// forEach skips tombstones
var m5 = new Map([['a', 1], ['b', 2], ['c', 3]]);
m5.delete('b');
var visited = '';
m5.forEach(function (v, k) { visited += k; });
if (visited !== 'ac') throw new Error("forEach skip: " + visited);

// ES2024 set methods do not leak tombstones
var big = new Set([1, 2, 3, 4]);
big.delete(3);
if ([...big.union(new Set([5]))].join(',') !== '1,2,4,5') throw new Error("union leaked tombstone");
if ([...big.intersection(new Set([2, 4]))].join(',') !== '2,4') throw new Error("intersection tombstone");

print("ok");

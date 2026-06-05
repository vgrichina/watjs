// ES2024 Set methods: union/intersection/difference/symmetricDifference + predicates
var a = new Set([1,2,3]), b = new Set([2,3,4]);
print([...a.union(b)].join(","));
print([...a.intersection(b)].join(","));
print([...a.difference(b)].join(","));
print([...a.symmetricDifference(b)].join(","));
print(a.isSubsetOf(new Set([1,2,3,4])));
print(a.isSubsetOf(b));
print(new Set([1,2,3,4]).isSupersetOf(a));
print(a.isDisjointFrom(new Set([5,6])));
print(a.isDisjointFrom(b));
print(a.union(b) instanceof Set);
// set-like object (size/has/keys protocol)
var sl = { size:2, has:function(x){return x===2||x===3;}, keys:function(){return [2,3].values();} };
print([...a.intersection(sl)].join(","));
print([...a.union(sl)].join(","));
// result ordering follows receiver then other
print([...new Set([3]).union(new Set([1,2]))].join(","));
// -0 normalized to +0
print(Object.is([...new Set([1]).union({size:1,has:function(){return false;},keys:function(){return [-0].values();}})][1], 0));
// GetSetRecord error paths
function thr(fn){ try{fn();return false;}catch(e){return e instanceof TypeError;} }
print(thr(function(){ a.union(null); }));
print(thr(function(){ a.union({size:undefined,has:function(){},keys:function(){}}); }));
print(thr(function(){ a.union({size:1,has:1,keys:function(){}}); }));
print(thr(function(){ a.union({size:1,has:function(){},keys:1}); }));
print(thr(function(){ Set.prototype.union.call(0, b); }));
// constructors accept any iterable
print([...new Set("abc")].join(","));
function* g(){ yield 1; yield 2; }
print([...new Set(g())].join(","));
var mm = new Map(new Map([["a",1],["b",2]]));
print(mm.get("a")+","+mm.get("b"));
print(thr(function(){ new Set(5); }));
print(thr(function(){ new Map([1,2]); }));

// TypedArray collection-returning methods yield the typed type
var a = new Int8Array([3,1,2]);
print(a.map(function(x){return x*2;}) instanceof Int8Array);
print(a.map(function(x){return x*2;}).join(","));
print(a.filter(function(x){return x>1;}) instanceof Int8Array);
print(a.filter(function(x){return x>1;}).join(","));
print(a.slice(1) instanceof Int8Array);
print(a.slice(1).join(","));
print(a.toSorted() instanceof Int8Array);
print(a.toSorted().join(","));
print(a.toReversed().join(","));
print(a.with(0, 9) instanceof Int8Array);
print(a.with(0, 9).join(","));
print(a.join(","));
// Array methods on array-likes (the gate fix) still work
print([3,1,2].toSorted().join(","));
print([1,2,3].with(1, 9).join(","));

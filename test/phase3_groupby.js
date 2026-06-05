// Object.groupBy / Map.groupBy (array-grouping)
var a = [1,2,3,4,5];
var o = Object.groupBy(a, function(x){ return x % 2 ? 'odd':'even'; });
print(Object.keys(o).join(","));
print(o.odd.join(","));
print(o.even.join(","));
print(Object.getPrototypeOf(o));
var m = Map.groupBy(a, function(x){ return x % 2 ? 'odd':'even'; });
print(Array.from(m.keys()).join(","));
print(m.get('odd').join(","));
print(m instanceof Map);
print(Object.groupBy([10,20], function(x,i){ return i; }) && Object.keys(Object.groupBy([10,20], function(x,i){ return i; })).join(","));
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ Object.groupBy(null, function(){}); }));
print(thr(function(){ Object.groupBy([1], 5); }));
print(thr(function(){ Map.groupBy(undefined, function(){}); }));
print(Object.groupBy.length);
print(Map.groupBy.length);

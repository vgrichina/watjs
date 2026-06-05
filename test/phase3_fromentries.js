// Object.fromEntries over any iterable, with entry validation + ToPropertyKey
var o = Object.fromEntries([["a",1],["b",2]]);
print(o.a + "," + o.b);
var m = new Map([["x",10],["y",20]]);
var o2 = Object.fromEntries(m);
print(o2.x + "," + o2.y);
var s = new Set([["k","v"]]);
print(Object.fromEntries(s).k);
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ Object.fromEntries(null); }));
print(thr(function(){ Object.fromEntries(5); }));
print(thr(function(){ Object.fromEntries([1,2]); }));   // entry not object
print(Object.fromEntries([]).constructor === Object);
// numeric/symbol keys via ToPropertyKey
print(Object.fromEntries([[1,"one"]])[1]);

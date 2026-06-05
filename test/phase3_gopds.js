// Object.getOwnPropertyDescriptors: null-throw + string source
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ Object.getOwnPropertyDescriptors(null); }));
print(thr(function(){ Object.getOwnPropertyDescriptors(undefined); }));
var d = Object.getOwnPropertyDescriptors("hi");
print(Object.keys(d).join(","));
print(JSON.stringify(d["0"]));
print(JSON.stringify(d.length));
var o = {a:1}; Object.defineProperty(o,"b",{value:2,enumerable:false});
var d2 = Object.getOwnPropertyDescriptors(o);
print(d2.a.value + "," + d2.a.enumerable);
print(d2.b.value + "," + d2.b.enumerable);

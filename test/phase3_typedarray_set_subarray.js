// TypedArray set / subarray
var a = new Int8Array([1,2,3,4,5]);
var sub = a.subarray(1, 4);
print(sub.length);
print([...sub].join(","));
sub[0] = 99;
print(a[1]);                    // shared buffer
print(sub instanceof Int8Array);
print(a.subarray(-2).join(","));// 4,5
print(a.subarray(2,1).length);  // 0
var b = new Int8Array(5);
b.set([10,20,30], 1);
print([...b].join(","));
b.set(new Int8Array([7,8]));
print([...b].join(","));
function rng(fn){try{fn();return false;}catch(e){return e instanceof RangeError;}}
print(rng(function(){ b.set([1,2,3,4,5,6]); }));
print(rng(function(){ b.set([1], -1); }));
print(Int8Array.prototype.set.length + "," + Int8Array.prototype.subarray.length);
print(typeof Float64Array.prototype.subarray);

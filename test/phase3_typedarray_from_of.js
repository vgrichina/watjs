// TypedArray.from / TypedArray.of (correctly-typed results)
print(Int8Array.from([1,2,3]).join(","));
print(Int8Array.from([1,2,3]) instanceof Int8Array);
print(Uint8Array.from([1,2,3], function(x){return x*10;}).join(","));
print(Float64Array.of(1.5, 2.5).join(","));
print(Int8Array.of(1,2,3) instanceof Int8Array);
print(Int16Array.from(new Set([10,20])).join(","));
print(Int8Array.from("AB", function(c){return c.charCodeAt(0);}).join(","));   // 65,66
print(typeof Int8Array.from + "," + typeof Int8Array.of);
print(Int8Array.from.length + "," + Int8Array.of.length);
print(BigInt64Array.from([1n,2n]).join(","));
print(BigInt64Array.of(3n,4n) instanceof BigInt64Array);
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ Int8Array.from(null); }));
print(thr(function(){ Int8Array.from([1], 5); }));
print(Int8Array.from([]).length);

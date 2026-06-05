// TypedArray constructor length validation (ToIndex)
function rng(fn){try{fn();return false;}catch(e){return e instanceof RangeError;}}
print(rng(function(){ new Int8Array(-1); }));
print(rng(function(){ new Int8Array(Infinity); }));
print(rng(function(){ new Float64Array(-5); }));
print(new Int8Array(2.5).length);     // ToIndex truncates → 2
print(new Int8Array(4).length);
print(new Int8Array(0).length);
// out-of-range index writes are silent no-ops
var a = new Int8Array(2); a[5] = 9; a[-1] = 7;
print(a.length + "," + (5 in a) + "," + a[5] + "," + a[-1]);

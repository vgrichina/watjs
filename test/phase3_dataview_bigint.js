// DataView BigInt64/BigUint64 + unary minus on BigInt
var dv = new DataView(new ArrayBuffer(16));
dv.setBigInt64(0, 123n);
print(dv.getBigInt64(0));
dv.setBigInt64(0, -5n, true);
print(dv.getBigInt64(0, true));
dv.setBigUint64(8, 1000n);
print(dv.getBigUint64(8));
print(typeof dv.getBigInt64);
print(DataView.prototype.setBigInt64.length + "," + DataView.prototype.getBigInt64.length);
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ dv.setBigInt64(0, 5); }));
function rng(fn){try{fn();return false;}catch(e){return e instanceof RangeError;}}
print(rng(function(){ dv.getBigInt64(12); }));
// unary minus preserves BigInt
print(typeof -5n);
print(-5n === 0n - 5n);
print(typeof -5);

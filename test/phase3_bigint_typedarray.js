// BigInt64Array / BigUint64Array
var a = new BigInt64Array(3);
print(a.length);
a[0] = 100n; a[1] = -50n;
print(a[0] + "," + a[1] + "," + a[2]);
print(typeof a[0]);
print(a instanceof BigInt64Array);
print(a.constructor === BigInt64Array);
print(BigInt64Array.BYTES_PER_ELEMENT + "," + BigUint64Array.BYTES_PER_ELEMENT);
print(Object.prototype.toString.call(a));
var b = new BigUint64Array([1n, 2n, 3n]);
print(b.length + ":" + b[1]);
print([...b].join(","));
print(b.map(function(x){return x*2n;}).join(","));
print(b.reduce(function(s,x){return s+x;}, 0n));
print(Object.prototype.toString.call(b));
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ a[0] = 5; }));     // Number into BigInt array → TypeError
print(thr(function(){ new BigInt64Array([1,2]); }));  // Number elements → TypeError
print(BigInt64Array.prototype.BYTES_PER_ELEMENT);  // 8

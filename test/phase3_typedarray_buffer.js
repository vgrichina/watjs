// TypedArray buffer / byteOffset accessors
var a = new Int8Array(8);
print(a.buffer instanceof ArrayBuffer);
print(a.buffer.byteLength);
print(a.byteOffset);
print(a.byteLength);
print(a.buffer === a.buffer);
var f = new Float64Array(3);
print(f.buffer.byteLength);
print(new Int16Array(4).byteLength);   // 8
var proto = Object.getPrototypeOf(Object.getPrototypeOf(a));  // %TypedArray.prototype%
var d = Object.getOwnPropertyDescriptor(proto, "buffer");
print(typeof d.get + "," + (d.set===undefined) + "," + d.enumerable + "," + d.configurable);
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ d.get.call({}); }));
print(thr(function(){ d.get.call(proto); }));   // prototype itself is not a TA

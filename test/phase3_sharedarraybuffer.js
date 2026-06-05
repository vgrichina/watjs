// SharedArrayBuffer (structurally like ArrayBuffer) + DataView over it
print(typeof SharedArrayBuffer);
var sab = new SharedArrayBuffer(16);
print(sab.byteLength);
print(Object.prototype.toString.call(sab));
var dv = new DataView(sab);
dv.setInt32(0, 42, true);
print(dv.getInt32(0, true));
print(dv.buffer === sab);
var d = Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, "byteLength");
print(typeof d.get + "," + d.set + "," + d.enumerable + "," + d.configurable);
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ d.get.call({}); }));
print(thr(function(){ d.get.call(false); }));
print(SharedArrayBuffer.length);
print(SharedArrayBuffer.prototype.constructor === SharedArrayBuffer);

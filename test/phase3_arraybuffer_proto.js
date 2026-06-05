// ArrayBuffer.prototype: byteLength accessor, slice, @@toStringTag; ArrayBuffer.isView
var ab = new ArrayBuffer(8);
print(ab.byteLength);
print(Object.prototype.toString.call(ab));
var d = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength");
print(typeof d.get + "," + (d.set===undefined) + "," + d.enumerable + "," + d.configurable);
var dv = new DataView(ab); dv.setInt32(0, 99);
var ab2 = ab.slice(0, 4);
print(ab2.byteLength);
print(new DataView(ab2).getInt32(0));
print(ab.slice(-4).byteLength);       // 4 (negative begin)
print(ArrayBuffer.isView(dv));
print(ArrayBuffer.isView(ab));
print(ArrayBuffer.isView(new Int8Array(4)));
print(ArrayBuffer.isView({}));
print(ArrayBuffer.isView(5));
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ d.get.call({}); }));
print(ArrayBuffer.prototype.slice.length);   // 2
print(ArrayBuffer.isView.length);            // 1

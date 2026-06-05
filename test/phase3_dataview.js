// DataView: typed get/set over an ArrayBuffer with explicit endianness
var ab = new ArrayBuffer(16);
var dv = new DataView(ab);
print(typeof DataView);
print(dv.byteLength + "," + dv.byteOffset);
dv.setInt32(0, 0x12345678);              // big-endian (default)
print(dv.getInt32(0).toString(16));
print(dv.getUint8(0).toString(16));      // MSB first
dv.setInt32(0, 0x12345678, true);        // little-endian
print(dv.getUint8(0).toString(16));      // LSB first
print(dv.getInt32(0, true).toString(16));
dv.setFloat64(8, 3.14); print(dv.getFloat64(8));
dv.setInt8(4, -5); print(dv.getInt8(4) + "," + dv.getUint8(4));
dv.setUint16(6, 0xABCD, true); print(dv.getUint16(6, true).toString(16));
print(dv.buffer === ab);
print(DataView.prototype.getInt32.length + "," + DataView.prototype.setInt32.length);
// byteOffset/byteLength sub-view
var dv2 = new DataView(ab, 4, 8);
print(dv2.byteOffset + "," + dv2.byteLength);
function rng(fn){try{fn();return false;}catch(e){return e instanceof RangeError;}}
print(rng(function(){ dv.getInt32(14); }));
print(rng(function(){ new DataView(ab, 20); }));
function te(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(te(function(){ new DataView({}); }));
print(te(function(){ DataView.prototype.getInt8.call({}, 0); }));
print(Object.prototype.toString.call(dv));

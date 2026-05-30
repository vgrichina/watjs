// Built-in function .name is { writable:false, enumerable:false, configurable:true }
var d = Object.getOwnPropertyDescriptor(parseInt, "name");
print("value=" + d.value);
print("writable=" + d.writable);
print("enumerable=" + d.enumerable);
print("configurable=" + d.configurable);

// non-writable: assignment is a silent no-op
parseInt.name = "clobbered";
print("after-assign=" + parseInt.name);

// non-enumerable: not visited by for-in
var seen = false;
for (var k in parseInt) { if (k === "name") seen = true; }
print("for-in-name=" + seen);

// configurable: deletable, then absent
print("hasOwn-before=" + parseInt.hasOwnProperty("name"));
delete parseInt.name;
print("hasOwn-after=" + parseInt.hasOwnProperty("name"));

// length is also non-writable and deletable
var fn = Math.max;
fn.length = 99;
print("length-after-assign=" + fn.length);

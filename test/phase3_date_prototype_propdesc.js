// Date.prototype is a non-writable, non-enumerable, non-configurable own property.
var d = Object.getOwnPropertyDescriptor(Date, "prototype");
if (d.writable !== false) throw new Error("writable");
if (d.enumerable !== false) throw new Error("enumerable");
if (d.configurable !== false) throw new Error("configurable");
if (Date.prototype.constructor !== Date) throw new Error("constructor link");
print("ok");

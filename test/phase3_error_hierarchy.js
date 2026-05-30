var e = new TypeError("m");
print("inst=" + (e instanceof TypeError) + "," + (e instanceof Error) + "," + (e instanceof Object));
print("name=" + e.name + " msg=" + e.message + " str=" + e.toString());
print("range=" + (new RangeError() instanceof Error));
print("ref=" + (new ReferenceError() instanceof Error));
print("proto-chain=" + (Object.getPrototypeOf(TypeError.prototype) === Error.prototype));
try { null.x; } catch (err) { print("caught=" + (err instanceof TypeError) + "," + (err instanceof Error)); }

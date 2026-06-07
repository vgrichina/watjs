print(Object.prototype.toString.call(new TypeError));
print(Object.prototype.toString.call(new Error));
print(Object.prototype.toString.call(new RangeError));
print(Object.prototype.toString.call(new AggregateError([])));
print(Object.prototype.toString.call(Error.prototype));
print(Object.prototype.toString.call(TypeError.prototype));
print(Object.prototype.toString.call({}));
print(Object.keys(new TypeError("x")).length);

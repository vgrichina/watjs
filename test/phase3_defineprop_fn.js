// Object.defineProperty / Reflect.defineProperty work on function targets;
// Error.isError exists
function F(){}
Object.defineProperty(F, "x", {value: 42, writable:false, enumerable:false, configurable:true});
print(F.x);
var d = Object.getOwnPropertyDescriptor(F, "x");
print(d.value + "," + d.writable + "," + d.enumerable + "," + d.configurable);
print(Reflect.defineProperty(F, "y", {value: 7}));
print(F.y);
// Error.isError
print(typeof Error.isError);
print(Error.isError(new Error()));
print(Error.isError(new TypeError()));
print(Error.isError({}));
print(Error.isError(42));
print(Error.isError.name);
print(Error.isError.length);
// defineProperties on a function target
function G(){}
Object.defineProperties(G, { a: {value:1, enumerable:false}, b: {value:2} });
print(G.a + "," + G.b);
print(Object.getOwnPropertyDescriptor(G, "a").enumerable);

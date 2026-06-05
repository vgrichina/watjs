// Error constructors callable without `new`; length is 1
print(Error("x").message);
print(Error("x") instanceof Error);
print(TypeError("t").message);
print(TypeError("t") instanceof TypeError);
print(TypeError("t") instanceof Error);
print(RangeError("r") instanceof Error);
print(Error.length);
print(TypeError.length);
print(RangeError.length);
print(new Error("n").message);
print(new Error("n") instanceof Error);
// cause option still works without new
print(Error("c", {cause: 42}).cause);
print(Error().message);     // "" (no message own prop -> inherited "")
print(Error("y").name);
print(Error("y").toString());

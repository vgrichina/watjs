var target = Symbol('foo');
var result = Object.assign(target, {a:1});
print(typeof result);
print(result.toString());
print(Object(Symbol("x")).toString());
print(typeof Object(Symbol("y")));

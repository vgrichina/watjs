function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
var o={};
o.__defineGetter__("x", function(){return 42;});
print(o.x);
print(o.__lookupGetter__("x") === Object.getOwnPropertyDescriptor(o,"x").get);
o.__defineSetter__("y", function(v){this._y=v;});
o.y=5; print(o._y);
print(typeof o.__lookupSetter__("y"));
print(Object.prototype.__defineGetter__.length);
print(Object.prototype.__lookupGetter__.length);
print(Object.getOwnPropertyDescriptor(o,"x").enumerable);
print(tc(function(){({}).__defineGetter__("z", 5);}));
print(tc(function(){Object.prototype.__lookupGetter__.call(null,"x");}));
print(({}).__lookupGetter__("missing"));
print(Object.prototype.propertyIsEnumerable("__defineGetter__"));

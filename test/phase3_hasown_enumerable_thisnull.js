function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print(({a:1}).hasOwnProperty("a"));
print(({a:1}).hasOwnProperty("b"));
print(tc(function(){Object.prototype.hasOwnProperty.call(null,"x");}));
print(tc(function(){Object.prototype.hasOwnProperty.call(undefined,"x");}));
print(tc(function(){Object.prototype.propertyIsEnumerable.call(null,"x");}));
print(tc(function(){Object.prototype.propertyIsEnumerable.call(undefined,"x");}));
print(({a:1}).propertyIsEnumerable("a"));

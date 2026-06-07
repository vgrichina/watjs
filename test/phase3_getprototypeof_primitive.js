function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print(Object.getPrototypeOf(5) === Number.prototype);
print(Object.getPrototypeOf("s") === String.prototype);
print(Object.getPrototypeOf(true) === Boolean.prototype);
print(tc(function(){Object.getPrototypeOf(null);}));
print(tc(function(){Object.getPrototypeOf(undefined);}));
print(Object.getPrototypeOf({}) === Object.prototype);

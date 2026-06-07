function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print(/l/.test("hello"));
print(/x/.test("hello"));
print(tc(function(){RegExp.prototype.test.call({},"hi");}));
print(tc(function(){RegExp.prototype.test.call(5,"hi");}));

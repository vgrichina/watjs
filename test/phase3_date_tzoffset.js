function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print(new Date(0).getTimezoneOffset());
print(new Date(NaN).getTimezoneOffset());
print(tc(function(){Date.prototype.getTimezoneOffset.call({});}));
print(tc(function(){Date.prototype.getTimezoneOffset.call(5);}));

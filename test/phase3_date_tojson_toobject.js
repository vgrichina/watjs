function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print(Date.prototype.toJSON.length);
print(tc(function(){Date.prototype.toJSON.call(null);}));
print(tc(function(){Date.prototype.toJSON.call(undefined);}));
print(new Date(0).toJSON());
print(new Date(NaN).toJSON());
print(Date.prototype.toJSON.call({valueOf:function(){return 5;},toISOString:function(){return "Z";}}));

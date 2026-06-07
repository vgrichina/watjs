function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print(typeof Object(5n));
print(tc(function(){JSON.stringify(Object(0n));}));
print(tc(function(){JSON.stringify(0n);}));
print(tc(function(){JSON.stringify({x:0n});}));
print(JSON.stringify(new Number(5)));
print(JSON.stringify({a:1}));

function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print(tc(function(){JSON.parse(Symbol());}));
print(JSON.parse(123));
print(JSON.parse("[1,2,3]").length);
print(JSON.parse("true"));

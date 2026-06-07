function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print(tc(function(){Object.assign(Object.freeze({a:1}),{a:2});}));
print(tc(function(){Object.assign(Object.seal({}),{b:1});}));
print(tc(function(){Object.assign(Object.preventExtensions({}),{c:1});}));
var ro={}; Object.defineProperty(ro,"x",{value:1,writable:false});
print(tc(function(){Object.assign(ro,{x:2});}));
print(JSON.stringify(Object.assign({},{a:1},{b:2})));
print(JSON.stringify(Object.assign({a:0},{a:5})));

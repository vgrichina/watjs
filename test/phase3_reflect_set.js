function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
var o={}; print(Reflect.set(o,"a",1)); print(o.a);
var ro={}; Object.defineProperty(ro,"x",{value:1,writable:false});
print(Reflect.set(ro,"x",2));
print(Reflect.set(Object.freeze({a:1}),"a",9));
print(Reflect.set(Object.preventExtensions({}),"new",1));
print(tc(function(){Reflect.set(5,"a",1);}));

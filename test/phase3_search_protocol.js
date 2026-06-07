function tc(f){try{return "ok:"+f();}catch(e){return e.constructor.name;}}
print("hello".search(/l/));
print("hello".search("ll"));
print("hello".search(/x/));
print(typeof RegExp.prototype[Symbol.search]);
var fake={}; fake[Symbol.search]=function(s){return 42;};
print("hi".search(fake));
print(/l/[Symbol.search]("hello"));

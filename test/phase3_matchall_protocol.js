function tc(f){try{return "ok:"+JSON.stringify(Array.from(f()));}catch(e){return e.constructor.name;}}
print(tc(function(){return "a1b2".matchAll(/\d/g);}));
print(tc(function(){return "abc".matchAll(/x/);}));
print(tc(function(){return "abc".matchAll("b");}));
print(typeof RegExp.prototype[Symbol.matchAll]);
var called=0;
var fake={}; fake[Symbol.matchAll]=function(s){called++;return [s];};
print(JSON.stringify(Array.from("hi".matchAll(fake)))+" "+called);
print(tc(function(){var r=/x/; Object.defineProperty(r,"flags",{get:function(){throw new TypeError("f");}}); "hi".matchAll(r); return 1;}));

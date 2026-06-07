function tc(f){try{return "ok:"+f();}catch(e){return e.constructor.name;}}
print(tc(function(){return String({[Symbol.toPrimitive]:42});}));
print(tc(function(){return String({toString:function(){return Symbol();}});}));
print(tc(function(){return String(Object.create(null));}));
print(tc(function(){return "abc".indexOf(123n);}));
print(String({}));
print(String({toString:function(){return "ok";}}));
print(tc(function(){return "abc".indexOf({valueOf:function(){return 0n;}, toString:undefined});}));

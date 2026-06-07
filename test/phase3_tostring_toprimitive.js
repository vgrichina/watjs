function tc(f){try{return "ok:"+f();}catch(e){return e.constructor.name;}}
print(String({}));
print(String({toString:function(){return "TS";}}));
print(String({toString:function(){return "TS";},valueOf:function(){return "VO";}}));
print(String({[Symbol.toPrimitive]:function(h){return "TP:"+h;}}));
print(String({toString:function(){return {};},valueOf:function(){return "fromVO";}}));
print(tc(function(){return String({toString:function(){throw new TypeError("x");}});}));
print(tc(function(){return String({toString:function(){return {};},valueOf:function(){return {};}});}));
print(tc(function(){return " x ".trimStart.call(null);}));
print(tc(function(){return " x ".trimEnd.call(Symbol());}));
print("["+String.prototype.trimStart.call({toString:function(){return "  hi  ";}})+"]");

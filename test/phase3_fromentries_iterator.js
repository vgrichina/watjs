function tc(f){try{return "ok:"+JSON.stringify(f());}catch(e){return e.constructor.name;}}
print(tc(function(){return Object.fromEntries([["a",1],["b",2]]);}));
print(tc(function(){return Object.fromEntries(new Map([["x",1]]));}));
print(tc(function(){return Object.fromEntries([1,2]);}));
var closed=0;
var it={ next:function(){ return {done:false, value:"bad"}; }, return:function(){ closed++; return {}; } };
var ib={}; ib[Symbol.iterator]=function(){return it;};
try{ Object.fromEntries(ib); }catch(e){}
print("closed="+closed);
var nc=0;
var it2={ next:function(){ return 5; }, return:function(){ nc++; return {}; } };
var ib2={}; ib2[Symbol.iterator]=function(){return it2;};
try{ Object.fromEntries(ib2); }catch(e){}
print("notClosed="+nc);

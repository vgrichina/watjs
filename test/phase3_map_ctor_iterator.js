function tc(f){try{return "ok:"+f();}catch(e){return e.constructor.name;}}
var m=new Map([["a",1],["b",2]]); print(m.get("a")+","+m.get("b"));
print(new Map().size);
print(tc(function(){return new Map([1,2]);}));
print(tc(function(){return new Map([["k","v"]]).get("k");}));
var closed=0;
var it={next:function(){return{done:false,value:"bad"};},return:function(){closed++;return{};}};
var ib={};ib[Symbol.iterator]=function(){return it;};
try{new Map(ib);}catch(e){}
print("closed="+closed);
var nc=0;
var it2={next:function(){throw new Error("x");},return:function(){nc++;return{};}};
var ib2={};ib2[Symbol.iterator]=function(){return it2;};
try{new Map(ib2);}catch(e){}
print("notClosed="+nc);

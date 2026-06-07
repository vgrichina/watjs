function tc(f){try{return "ok:"+f();}catch(e){return e.constructor.name;}}
var s=new Set([1,2,2,3]); print(s.size);
print(new Set().size);
print(s.has(2));
print(tc(function(){return new Set(5);}));
var calls=[];
var it={next:(function(){var i=0;return function(){return i<2?{done:false,value:i++}:{done:true};};})()};
var ib={};ib[Symbol.iterator]=function(){return it;};
print(new Set(ib).size);

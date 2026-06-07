function tc(f){try{return "ok:"+f();}catch(e){return e.constructor.name;}}
print(Array.from([1,2,3]).join(","));
print(Array.from([1,2,3], function(x){return x*2;}).join(","));
print(Array.from(new Set([1,2,2])).join(","));
print(Array.from({length:2,0:"a",1:"b"}).join(","));
var closed=0;
var it={next:(function(){var i=0;return function(){return i<3?{done:false,value:i++}:{done:true};};})(),return:function(){closed++;return{};}};
var ib={};ib[Symbol.iterator]=function(){return it;};
print(tc(function(){return Array.from(ib, function(){throw new Error("x");});})+" closed="+closed);
var ta=[]; Array.from([1,2],function(x){ta.push(this.v+x);},{v:10}); print(ta.join(","));

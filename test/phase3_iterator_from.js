// Iterator.from: wrap iterables/raw iterators so the helpers are available
print(typeof Iterator.from);
print(Iterator.from([1,2,3]).toArray().join(","));
function* g(){ yield 4; yield 5; }
print(Iterator.from(g()).map(function(x){return x*2;}).toArray().join(","));
var raw = { i:0, next:function(){ return this.i<3 ? {value:this.i++,done:false}:{value:undefined,done:true}; } };
print(Iterator.from(raw).toArray().join(","));
print(Iterator.from({i:0,next:function(){return {value:9,done:true};}}) instanceof Iterator);
print(Iterator.from("hi").toArray().join(","));
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ Iterator.from(5); }));
print(thr(function(){ Iterator.from(null); }));
print(Iterator.from.length);

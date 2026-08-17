// Iterator + %Iterator.prototype% eager helpers, inherited by generators/array iterators
print(typeof Iterator);
print(typeof Iterator.prototype.toArray);
function* g(){ yield 1; yield 2; yield 3; }
print(g().toArray().join(","));
var sum = 0; g().forEach(function(v,i){ sum += v*(i+1); }); print(sum);
print(g().reduce(function(a,b){return a+b;}));
print(g().reduce(function(a,b){return a+b;}, 10));
print(g().some(function(v){return v===2;}));
print(g().every(function(v){return v<3;}));
print(g().find(function(v){return v>1;}));
print([10,20,30].values().toArray().join(","));
print([1,2,3].values().reduce(function(a,b){return a+b;}));
print(new Set([4,5]).values().toArray().join(","));
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ new Iterator(); }));
print(thr(function(){ Iterator.prototype.toArray.call(5); }));
print(thr(function(){ g().forEach(5); }));
print(thr(function(){ [].values().reduce(function(a,b){return a+b;}); }));   // empty + no init
print(Iterator.prototype.forEach.length);
print(Iterator.prototype.toArray.length);
// g() → g.prototype → %GeneratorPrototype% → %IteratorPrototype% (instance [[Prototype]] is g.prototype)
print(Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(g()))) === Iterator.prototype);

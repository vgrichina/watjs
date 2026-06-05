// Lazy Iterator helpers: map/filter/take/drop/flatMap
function* g(){ yield 1; yield 2; yield 3; yield 4; yield 5; }
print(g().map(function(x){return x*2;}).toArray().join(","));
print(g().filter(function(x){return x%2;}).toArray().join(","));
print(g().take(2).toArray().join(","));
print(g().drop(2).toArray().join(","));
print(g().flatMap(function(x){return [x,x*10];}).toArray().join(","));
print(g().map(function(x){return x+1;}).filter(function(x){return x%2;}).toArray().join(","));
print(g().take(0).toArray().length);
print(g().drop(10).toArray().length);
print(g().map(function(x,i){return i;}).toArray().join(","));
// laziness: take from an infinite iterator pulls exactly N
var pulls = 0;
function* counter(){ while(true){ pulls++; yield pulls; } }
print(counter().take(3).toArray().join(","));
print(pulls);
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ g().map(5); }));
function rng(fn){try{fn();return false;}catch(e){return e instanceof RangeError;}}
print(rng(function(){ g().take(-1); }));
print(g().map(function(x){return x;}) instanceof Iterator ? "isIter" : "no");
print(Iterator.prototype.map.length);

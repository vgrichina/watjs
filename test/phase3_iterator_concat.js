// Iterator.concat: concatenate iterables, lazily, in order
print(typeof Iterator.concat);
print(Iterator.concat([1,2],[3,4],[5]).toArray().join(","));
print(Iterator.concat().toArray().length);
print(Iterator.concat(new Set([1,2]), [3]).toArray().join(","));
function* g(){ yield 9; yield 8; }
print(Iterator.concat(g(), [7]).toArray().join(","));
print(Iterator.concat([1]).map(function(x){return x*2;}).toArray().join(","));
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ Iterator.concat(5); }));
print(thr(function(){ Iterator.concat({}); }));
print(Iterator.concat([1]) instanceof Iterator);
print(Iterator.concat.length);

// Iterator.zip: shortest / longest / strict
print(typeof Iterator.zip);
print(JSON.stringify(Iterator.zip([[1,2,3],[4,5]]).toArray()));
print(JSON.stringify(Iterator.zip([[1,2],[3,4],[5,6]]).toArray()));
print(JSON.stringify(Iterator.zip([[1,2,3],[4]], {mode:"longest", padding:[0,9]}).toArray()));
print(JSON.stringify(Iterator.zip([[1],[2,3]], {mode:"longest"}).toArray()));
print(JSON.stringify(Iterator.zip([[1,2],[3,4]], {mode:"strict"}).toArray()));
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ Iterator.zip([[1,2],[3]], {mode:"strict"}).toArray(); }));
print(thr(function(){ Iterator.zip([[1]], {mode:"bogus"}); }));
print(thr(function(){ Iterator.zip(5); }));
print(thr(function(){ Iterator.zip([5]); }));
print(Iterator.zip([[1]]) instanceof Iterator);
print(JSON.stringify(Iterator.zip([]).toArray()));

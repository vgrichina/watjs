// Iterator.zipKeyed: keyed by the object's own enumerable keys; shortest/longest/strict
print(typeof Iterator.zipKeyed);
print(JSON.stringify(Iterator.zipKeyed({a:[1,2], b:[3,4]}).toArray()));
print(Object.keys(Iterator.zipKeyed({a:[1], b:[2]}).next().value).join(","));
print(JSON.stringify(Iterator.zipKeyed({x:[1,2,3], y:[4]}).toArray()));
print(JSON.stringify(Iterator.zipKeyed({x:[1,2], y:[3]}, {mode:"longest", padding:{y:99}}).toArray()));
print(JSON.stringify(Iterator.zipKeyed({a:[1],b:[2]}, {mode:"strict"}).toArray()));
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ Iterator.zipKeyed({a:[1],b:[2,3]}, {mode:"strict"}).toArray(); }));
print(thr(function(){ Iterator.zipKeyed({a:5}); }));
print(thr(function(){ Iterator.zipKeyed(5); }));
print(Iterator.zipKeyed({a:[1]}) instanceof Iterator);
// zip still yields arrays (not objects)
print(JSON.stringify(Iterator.zip([[1,2],[3,4]]).toArray()));

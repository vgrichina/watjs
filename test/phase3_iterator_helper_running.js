// %IteratorHelperPrototype%.next throws TypeError on re-entrant resume (executing state)
function thr(f){ try { f(); return false; } catch(e){ return e instanceof TypeError; } }

// map: re-entry from within the mapper
var it1, enter1 = 0;
it1 = [1,2,3].values().map(function(){ enter1++; it1.next(); return 0; });
if (!thr(function(){ it1.next(); })) throw "map-not-TypeError";
if (enter1 !== 1) throw "map-enter:"+enter1;

// take: re-entry from within the source's next
var it2, enter2 = 0;
class Src extends Iterator { next(){ enter2++; it2.next(); return {done:false,value:1}; } }
it2 = new Src().take(100);
if (!thr(function(){ it2.next(); })) throw "take-not-TypeError";
if (enter2 !== 1) throw "take-enter:"+enter2;

// filter re-entry
var it3;
it3 = [1,2,3].values().filter(function(){ it3.next(); return true; });
if (!thr(function(){ it3.next(); })) throw "filter-not-TypeError";

// helpers still work normally (sequential next calls aren't blocked)
var m = [1,2,3,4].values().map(function(x){ return x+10; });
if (m.next().value !== 11) throw "m1";
if (m.next().value !== 12) throw "m2";
if (m.next().value !== 13) throw "m3";
if ([1,2,3,4,5].values().filter(function(x){return x%2;}).toArray().join(",") !== "1,3,5") throw "filter-chain";
print("ok");

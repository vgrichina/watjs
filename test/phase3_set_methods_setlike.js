// GetSetRecord accepts any Object (arrays/functions too), not just plain objects —
// it then validates .size/.has/.keys. An array has no .size → throws on ToNumber(NaN).
var s = new Set([1,2,3]);
var threw=false; try { s.isSupersetOf([1,2]); } catch(e){ threw = e instanceof TypeError; }
if (!threw) throw "array without size must throw TypeError (not 'must be object')";
// a set-like plain object with size/has/keys works
var setlike = { size:2, has:function(v){ return v===2||v===3; }, keys:function(){ return [2,3][Symbol.iterator](); } };
if (s.isSupersetOf(setlike) !== true) throw "isSupersetOf setlike";
if (s.isSubsetOf({ size:5, has:function(v){return v>=1&&v<=5;}, keys:function(){return [1,2,3,4,5][Symbol.iterator]();} }) !== true) throw "isSubsetOf setlike";
print("ok");

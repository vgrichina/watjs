// Set.prototype.forEach / Map.prototype.forEach must throw TypeError when the
// callback is not callable (checked before iterating).
var s = new Set([1,2]), m = new Map([[1,2]]);
[null, undefined, 5, "x", true, Symbol()].forEach(function(bad){
  var st=false; try{ s.forEach(bad); }catch(e){ st = e instanceof TypeError; }
  if(!st) throw "Set.forEach should reject "+String(bad);
  var mt=false; try{ m.forEach(bad); }catch(e){ mt = e instanceof TypeError; }
  if(!mt) throw "Map.forEach should reject "+String(bad);
});
// normal forEach still works (value, value, set) / (value, key, map)
var so=[]; s.forEach(function(v1,v2,set){ if(v1!==v2||set!==s) throw "set args"; so.push(v1); });
if(so.join(",")!=="1,2") throw "set iterate";
var mo=[]; m.forEach(function(v,k,map){ if(map!==m) throw "map arg"; mo.push(k+"="+v); });
if(mo.join(",")!=="1=2") throw "map iterate";
print("ok");

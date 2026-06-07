print([1,2,3,4].findLast(function(x){return x<3;}));
print([1,2,3].findLastIndex(function(x){return x<3;}));
print([1,2,3].findLast(function(x,i,arr){return arr.length===3&&i===2;}));
var th=[]; [1,2].findLast(function(x){th.push(this.v);return false;},{v:9}); print(th.join(","));
print([1,2,3].findLast(function(){return false;}));
print([1,2,3].findLastIndex(function(){return false;}));

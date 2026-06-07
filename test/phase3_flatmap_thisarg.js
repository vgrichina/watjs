function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
var collected=[];
[1,2].flatMap(function(x){ collected.push(this.v+x); return [x]; }, {v:10});
print(collected.join(","));
print(JSON.stringify([1,2,3].flatMap(function(x){return [x,x*2];})));
var third;
[1].flatMap(function(x,i,a){ third=Array.isArray(a); return [x]; });
print(third);
print(tc(function(){[1,2].flatMap(function(){throw new Error("x");});}));
print(tc(function(){[1].flatMap(5);}));

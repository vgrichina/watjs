print(Math.sumPrecise.name);
print(Math.sumPrecise.length);
print(1/Math.sumPrecise([]));
print(1/Math.sumPrecise([-0]));
print(1/Math.sumPrecise([-0,0]));
print(Math.sumPrecise([1,2,3,4]));
print(Math.sumPrecise([NaN]));
print(Math.sumPrecise([Infinity,-Infinity]));
function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print(tc(function(){Math.sumPrecise([{}]);}));
print(tc(function(){Math.sumPrecise([0n]);}));
print(tc(function(){Math.sumPrecise(5);}));

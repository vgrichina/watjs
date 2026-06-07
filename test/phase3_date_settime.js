function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
var d=new Date(0);
print(d.setTime(1000)); print(d.getTime());
print(d.setTime(8.64e15));
print(d.setTime(8.64e15+1));
print(tc(function(){Date.prototype.setTime.call({},5);}));
print(tc(function(){Date.prototype.setTime.call(5,5);}));
print(tc(function(){new Date(0).setTime({valueOf:function(){throw new TypeError("x");}});}));

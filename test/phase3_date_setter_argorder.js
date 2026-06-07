var d=new Date(Date.UTC(2020,0,1,0,0,0,0));
d.setUTCHours(10,30,45,123);
print(d.getUTCHours()+":"+d.getUTCMinutes()+":"+d.getUTCSeconds()+"."+d.getUTCMilliseconds());
var order=[];
var d2=new Date(0);
d2.setUTCHours({valueOf:function(){order.push("h");return 5;}},{valueOf:function(){order.push("m");return NaN;}},{valueOf:function(){order.push("s");return 9;}});
print(order.join(","));
print(d2.getTime());
function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print(tc(function(){new Date(0).setSeconds({valueOf:function(){throw new TypeError("x");}});}));
print(new Date(Date.UTC(2020,5,15)).getUTCMonth());

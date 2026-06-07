function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
var d=new Date(Date.UTC(2020,0,1));
print(d[Symbol.toPrimitive]("number"));
print(typeof d[Symbol.toPrimitive]("string"));
print(typeof d[Symbol.toPrimitive]("default"));
print(tc(function(){d[Symbol.toPrimitive]("bogus");}));
print(tc(function(){d[Symbol.toPrimitive]();}));
print(+d);
print(new Date(NaN).toJSON());
print(d.toJSON());

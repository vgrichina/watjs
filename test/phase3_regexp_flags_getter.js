function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print(/abc/gi.flags);
print(/x/.flags);
print(/a/dgimsuy.flags);
var fg=Object.getOwnPropertyDescriptor(RegExp.prototype,"flags").get;
print(fg.call({global:true,ignoreCase:true,sticky:true}));
print(fg.call({}));
print(tc(function(){fg.call(5);}));

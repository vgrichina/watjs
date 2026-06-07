function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print(/abc/.source);
print(/a/g.global);
print(/a/.global);
print(/a/im.ignoreCase);
var sg=Object.getOwnPropertyDescriptor(RegExp.prototype,"source").get;
var gg=Object.getOwnPropertyDescriptor(RegExp.prototype,"global").get;
print(tc(function(){sg.call({});}));
print(tc(function(){sg.call(5);}));
print(tc(function(){gg.call({});}));
print(sg.call(RegExp.prototype));
print(gg.call(RegExp.prototype));

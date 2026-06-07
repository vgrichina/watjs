function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print("aaa".replaceAll("a","b"));
print(String.prototype.replaceAll.length);
print(tc(function(){String.prototype.replaceAll.call(null,"a","b");}));
print(tc(function(){String.prototype.replaceAll.call(undefined,"a","b");}));
print(tc(function(){"abc".replaceAll(Symbol(),"x");}));
print(tc(function(){"abc".replaceAll(/x/,"y");}));
print("axbxc".replaceAll(/x/g,"-"));

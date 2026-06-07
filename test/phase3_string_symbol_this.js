function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print(tc(function(){String.prototype.substring.call(Symbol());}));
print(tc(function(){String.prototype.slice.call(Symbol());}));
print(tc(function(){String.prototype.substr.call(Symbol());}));
print(tc(function(){String.prototype.charAt.call(Symbol());}));
print(tc(function(){String.prototype.toUpperCase.call(Symbol());}));
print(tc(function(){String.prototype.indexOf.call(Symbol(),"x");}));
print("hello".substring(1,3));
print("hello".slice(1,3));

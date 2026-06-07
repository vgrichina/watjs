function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print("abcabc".lastIndexOf("bc"));
print("abcabc".lastIndexOf("bc", 2));
print("abcabc".lastIndexOf("a", NaN));
print("aaa".lastIndexOf("a"));
print(tc(function(){"abc".lastIndexOf(Symbol());}));
print(tc(function(){"abc".lastIndexOf("a", 0n);}));

print("abcdef".endsWith("cd", 4));
print("abcdef".endsWith("ab", 2));
print("abcdef".endsWith("abc", 3));
print("abcdef".endsWith("ef"));
print("abcdef".endsWith("c", 3));
function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print(tc(function(){"abc".endsWith(/x/);}));
print(tc(function(){"abc".endsWith(Symbol());}));
print(tc(function(){"abc".endsWith("a", Symbol());}));
print(tc(function(){"abc".includes(Symbol());}));
print(tc(function(){"abc".startsWith(Symbol());}));

function tc(f){try{return "ok:"+f();}catch(e){return e.constructor.name;}}
print("".repeat(2147483647).length);
print("ab".repeat(3));
print("ab".repeat(0).length);
print(tc(function(){return "ab".repeat(-1);}));
print(tc(function(){return "ab".repeat(Infinity);}));
print(tc(function(){return "ab".repeat(0n);}));

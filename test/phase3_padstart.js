function tc(f){try{return "ok:"+f();}catch(e){return e.constructor.name;}}
print("5".padStart(3,"0"));
print("5".padEnd(3,"0"));
print("5".padStart(3));
print("abcde".padStart(2, Symbol()));
print(tc(function(){return "x".padStart(5, Symbol());}));
print(tc(function(){return "x".padStart(0n);}));
print("x".padStart(5,"").length);
print("abc".padStart(10,"123").length);

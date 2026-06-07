function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print(String.fromCodePoint(65,66));
print(String.fromCodePoint(0x20AC)==="€");
print(String.fromCodePoint.length);
print(tc(function(){String.fromCodePoint(-1);}));
print(tc(function(){String.fromCodePoint(1.5);}));
print(tc(function(){String.fromCodePoint(0x110000);}));
print(tc(function(){String.fromCodePoint(NaN);}));
print("["+String.fromCodePoint()+"]");

var p = {a:1}; Object.preventExtensions(p); p.b = 2;
print("noext-add=" + (p.b === undefined) + " ext=" + Object.isExtensible(p) + " keep=" + p.a);
var s = {x:1}; Object.seal(s); s.y = 2; s.x = 9;
print("seal-add=" + (s.y === undefined) + " seal-write=" + s.x + " isSealed=" + Object.isSealed(s) + " del=" + (delete s.x));
var f = {z:1}; Object.freeze(f); f.z = 5; f.w = 6;
print("freeze=" + f.z + "," + (f.w === undefined) + " isFrozen=" + Object.isFrozen(f));

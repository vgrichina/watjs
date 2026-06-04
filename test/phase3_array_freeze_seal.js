function p(n,v){print(n+"="+v);}
var a=[1,2,3]; Object.freeze(a);
a[0]=99; a.length=1; a[5]=6;
p("frozen-elem", a[0]);          // 1
p("frozen-len", a.length);       // 3
p("frozen-noadd", a[5]);         // undefined
p("isFrozen", Object.isFrozen(a));         // true
p("frozen-notExt", Object.isExtensible(a)); // false
var fresh=[1,2,3];
p("fresh-isFrozen", Object.isFrozen(fresh));     // false
p("fresh-isExtensible", Object.isExtensible(fresh)); // true
p("fresh-isSealed", Object.isSealed(fresh));     // false
var s=[1,2,3]; Object.seal(s); s[0]=9; s[5]=6;
p("sealed-write", s[0]);         // 9 (existing element writable)
p("sealed-noadd", s[5]);         // undefined
p("sealed-isSealed", Object.isSealed(s));   // true
var p2=[1]; Object.preventExtensions(p2); p2[0]=8; p2[1]=9;
p("noext-write", p2[0]);         // 8
p("noext-noadd", p2[1]);         // undefined

print("hello".replace(/l/,"L"));
print("hello".replace(/l/g,"L"));
print("a1b2".replace(/(\d)/g,"[$1]"));
print("hello".replace("l","L"));
print("abc".replace(/b/,function(m){return m.toUpperCase();}));
print(typeof RegExp.prototype[Symbol.replace]);
var fake={}; fake[Symbol.replace]=function(s,r){return "custom:"+s+":"+r;};
print("hi".replace(fake,"X"));
print(/l/g[Symbol.replace]("hello","L"));

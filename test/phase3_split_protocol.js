print(JSON.stringify("a-b-c".split(/-/)));
print(JSON.stringify("a1b2c".split(/\d/)));
print(JSON.stringify("a,b,c".split(",")));
print(JSON.stringify("hello".split(/l/, 2)));
print(JSON.stringify("a-b-c".split(/(-)/)));
print(typeof RegExp.prototype[Symbol.split]);
var fake={}; fake[Symbol.split]=function(s,l){return ["custom",s];};
print(JSON.stringify("hi".split(fake)));
print(JSON.stringify(/-/[Symbol.split]("a-b-c")));

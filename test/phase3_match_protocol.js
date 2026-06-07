print(JSON.stringify("hello".match(/l/)));
print(JSON.stringify("hello".match(/l/g)));
print(JSON.stringify("hello".match(/x/)));
print(JSON.stringify("a1b2".match(/\d/g)));
print(JSON.stringify("hello".match("ll")));
print(typeof RegExp.prototype[Symbol.match]);
var fake={}; fake[Symbol.match]=function(s){return ["custom"];};
print(JSON.stringify("hi".match(fake)));
print(JSON.stringify(/(l)/[Symbol.match]("hello")));

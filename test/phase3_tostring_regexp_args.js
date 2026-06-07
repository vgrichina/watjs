print(Object.prototype.toString.call(/x/));
function f(){ return Object.prototype.toString.call(arguments); }
print(f(1,2));
print(Object.prototype.toString.call(new RegExp("a")));
print(Object.prototype.toString.call([]));
print(Object.prototype.toString.call(new Date()));

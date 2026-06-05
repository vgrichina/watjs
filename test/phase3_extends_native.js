// class extends <native>: prototype chain links to the native's prototype
class MyIter extends Iterator {
  constructor(){ super(); this.i = 0; }
  next(){ return this.i < 3 ? {value: this.i++, done:false} : {value:undefined, done:true}; }
}
var it = new MyIter();
print(it instanceof Iterator);
print(it instanceof MyIter);
print(Object.getPrototypeOf(MyIter.prototype) === Iterator.prototype);
print(it.toArray().join(","));
print(new MyIter().map(function(x){return x*10;}).toArray().join(","));
class MyArr extends Array {}
print(Object.getPrototypeOf(MyArr.prototype) === Array.prototype);
class MyErr extends Error { constructor(m){ super(m); } }
var e = new MyErr("boom");
print(e instanceof Error);
print(e instanceof MyErr);
print(Object.getPrototypeOf(MyErr.prototype) === Error.prototype);
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ new Iterator(); }));

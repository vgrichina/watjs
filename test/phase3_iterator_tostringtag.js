// Iterator.prototype[@@toStringTag] is an accessor (get "Iterator", set ignores prototype)
print(Iterator.prototype[Symbol.toStringTag]);
var d = Object.getOwnPropertyDescriptor(Iterator.prototype, Symbol.toStringTag);
print(typeof d.get + "," + typeof d.set + "," + d.enumerable + "," + d.configurable);
print(d.value + "," + d.writable);
print(d.get.call());
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ d.set.call(undefined, ""); }));
print(thr(function(){ d.set.call(Iterator.prototype, ""); }));
var fake = Object.create(Iterator.prototype);
fake[Symbol.toStringTag] = "Custom";
print(fake[Symbol.toStringTag]);
print(Iterator.prototype[Symbol.toStringTag]);

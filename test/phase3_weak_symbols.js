// @@toStringTag non-writable + registered symbols can't be held weakly
function d(o,k){ var x=Object.getOwnPropertyDescriptor(o,k); return x.writable+","+x.enumerable+","+x.configurable; }
print(d(Set.prototype, Symbol.toStringTag));
print(d(WeakRef.prototype, Symbol.toStringTag));
print(d(FinalizationRegistry.prototype, Symbol.toStringTag));
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(new WeakRef(Symbol()) instanceof WeakRef);
print(thr(function(){ new WeakRef(Symbol.for("x")); }));
var wm = new WeakMap();
print(wm.set(Symbol(), 1) === wm);
print(thr(function(){ wm.set(Symbol.for("y"), 1); }));
print(thr(function(){ new WeakSet().add(Symbol.for("z")); }));
print(thr(function(){ new FinalizationRegistry(function(){}).register(Symbol.for("w"), "h"); }));

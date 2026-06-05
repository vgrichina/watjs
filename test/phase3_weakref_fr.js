// WeakRef + FinalizationRegistry (strong-ref; cleanup never runs)
var t = {};
var wr = new WeakRef(t);
print(wr.deref() === t);
print(wr.deref() === t);
print(WeakRef.prototype.deref.length);
print(typeof WeakRef);
print(Object.prototype.toString.call(wr));
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ new WeakRef(5); }));
print(new WeakRef(Symbol()) instanceof WeakRef);
var fr = new FinalizationRegistry(function(){});
var tok = {};
print(fr.register(t, "held", tok));
print(fr.unregister(tok));
print(fr.unregister(tok));
print(thr(function(){ new FinalizationRegistry(5); }));
print(thr(function(){ fr.register(5, "h"); }));
print(thr(function(){ fr.register(t, t); }));
print(FinalizationRegistry.prototype.register.length);
print(Object.prototype.toString.call(fr));

// A generator (or async) function invoked through the native->VM bridge (call_val /
// call_fn0) — e.g. a set-like object's `keys: function*(){}` used by Set set-methods,
// or any iterator whose method is a generator — must create a generator object, not
// dispatch its internal magic number as a native id.
var s = new Set([1, 2, 3]);
var setlike = {
  size: 2,
  has: function(v){ return v === 2 || v === 3; },
  keys: function*(){ yield 2; yield 3; }   // generator method, called via the native bridge
};
if (s.isSupersetOf(setlike) !== true) throw "isSupersetOf with generator keys";
if (s.union(setlike).size !== 3) throw "union with generator keys";
// generator as an object's @@iterator, consumed by spread (native iterator path)
var obj = {};
obj[Symbol.iterator] = function*(){ yield 10; yield 20; };
if ([...obj].join(",") !== "10,20") throw "spread generator @@iterator";
print("ok");

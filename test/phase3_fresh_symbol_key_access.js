// Accessing a symbol-keyed property on a freshly-allocated object must not crash
// (heap_alloc now zero-initialises blocks, so an uninitialised pointer field can't
// be read as garbage). Repeated to exercise varying heap states.
for (var i = 0; i < 50; i++) {
  var o = {};
  if (o[Symbol.iterator] !== undefined) throw new Error("plain {} sym");
  var k = Symbol();
  if (o[k] !== undefined) throw new Error("user sym");
  function F() {} var fi = new F();
  if (fi[Symbol.iterator] !== undefined) throw new Error("fn instance sym");
  class C {} var ci = new C();
  if (ci[Symbol.asyncIterator] !== undefined) throw new Error("class instance sym");
}
print("ok");

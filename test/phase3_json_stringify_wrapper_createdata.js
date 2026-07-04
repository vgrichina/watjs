// JSON.stringify builds its initial wrapper { "": value } with CreateDataProperty, not [[Set]],
// so an inherited setter for the empty-string key on Object.prototype must NOT be invoked.
Object.defineProperty(Object.prototype, "", {
  configurable: true,
  set: function () { throw new Error("[[Set]] must not be called"); },
});
var value = { a: 1 };
var wrapper;
var out = JSON.stringify(value, function (k, v) { if (k === "") wrapper = this; return v; });
if (out !== '{"a":1}') throw new Error("output: " + out);
if (typeof wrapper !== "object") throw new Error("wrapper not an object");
if (Object.getPrototypeOf(wrapper) !== Object.prototype) throw new Error("wrapper proto");
var d = Object.getOwnPropertyDescriptor(wrapper, "");
if (!d || d.value !== value || !d.writable || !d.enumerable || !d.configurable)
  throw new Error("wrapper[''] must be a writable/enumerable/configurable data property");
delete Object.prototype[""];
print("ok");

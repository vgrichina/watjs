// Every built-in constructor's `prototype` own property is {W:false,E:false,C:false}.
["Boolean","Number","String","Array","RegExp","Symbol","BigInt","Object","Function"].forEach(function (n) {
  var d = Object.getOwnPropertyDescriptor(globalThis[n], "prototype");
  if (d.writable !== false || d.enumerable !== false || d.configurable !== false)
    throw new Error(n + ".prototype descriptor wrong: " + JSON.stringify(d));
});
// construction and prototype links still work
if (new Number(5).valueOf() !== 5) throw new Error("new Number");
if (!(new Array(3) instanceof Array)) throw new Error("new Array");
if (Number.prototype.constructor !== Number) throw new Error("constructor link");
print("ok");

// The `in` operator on an array walks the prototype chain (Array.prototype →
// Object.prototype), consistent with property Get.
var ap = Array.prototype.value;
Array.prototype.value = "Array";
try {
  var arr = [1, 2, 3];
  if (!("value" in arr)) throw new Error("inherited Array.prototype prop");
  if (!("push" in arr)) throw new Error("inherited method");
  if (!("toString" in arr)) throw new Error("inherited from Object.prototype");
  if (!(0 in arr) || !("length" in arr)) throw new Error("own");
  if (5 in arr) throw new Error("missing index");
  if ("nope" in arr) throw new Error("absent");
  // defineProperty with an array Attributes reads its inherited 'value'
  var obj = {};
  Object.defineProperty(obj, "property", arr);
  if (obj.property !== "Array") throw new Error("defineProperty array Attributes: " + obj.property);
} finally { if (ap === undefined) delete Array.prototype.value; else Array.prototype.value = ap; }
print("ok");

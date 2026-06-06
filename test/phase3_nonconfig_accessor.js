// Non-configurable accessor invariants + length-cannot-be-accessor.
function p(n, v) { print(n + "=" + v); }

// Object.defineProperty(arr, "length", {get}) → TypeError (length is data)
var a = [];
var e1 = false; try { Object.defineProperty(a, "length", { get: function () { return 2; } }); } catch (e) { e1 = e.constructor.name === "TypeError"; }
p("len-acc", e1);

// changing the setter of a non-configurable accessor → TypeError
var o = {};
Object.defineProperty(o, "foo", { get: function () { return 1; } }); // configurable:false by default
var e2 = false; try { Object.defineProperty(o, "foo", { set: function (x) {} }); } catch (e) { e2 = e.constructor.name === "TypeError"; }
p("acc-set", e2);

// changing the getter of a non-configurable accessor → TypeError
var o2 = {};
Object.defineProperty(o2, "prop", { get: undefined, set: undefined, enumerable: true, configurable: false });
var e3 = false; try { Object.defineProperty(o2, "prop", { get: function () { return 1001; } }); } catch (e) { e3 = e.constructor.name === "TypeError"; }
p("acc-get", e3);

// redefining with the SAME getter is allowed (no throw)
var g = function () { return 5; };
var o3 = {}; Object.defineProperty(o3, "x", { get: g });
var e4 = "ok"; try { Object.defineProperty(o3, "x", { get: g }); } catch (e) { e4 = "threw"; }
p("same", e4 + "," + o3.x);

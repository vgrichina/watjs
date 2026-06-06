// Array index accessor / attributed-data descriptors ("deopt" into the @12 scope).
// getter at an index is invoked on direct access AND during iteration builtins.
var a = [1, 2, 3];
Object.defineProperty(a, "1", { get: function () { return 99; } });
print("get=" + a[1]);                 // 99
print("len=" + a.length);             // 3

var b = [10, 20];
Object.defineProperty(b, "0", { get: function () { return 100; }, configurable: true });
print("reduce=" + b.reduce(function (s, x) { return s + x; }, 0)); // 120 (getter seen by reduce)
print("idx0=" + b[0]);                // 100
var d = Object.getOwnPropertyDescriptor(b, "0");
print("gopd=" + (d ? typeof d.get : "none")); // function

// setter index + getter mirror
var c = [1, 2, 3];
var seen;
Object.defineProperty(c, "1", {
  set: function (v) { seen = v; },
  get: function () { return seen; },
  configurable: true,
});
c[1] = 42;
print("set=" + c[1] + "," + seen);    // 42,42

// non-writable data index: assignment ignored, value preserved, neighbours intact
var e = [10, 20, 30];
Object.defineProperty(e, "0", { value: 99, writable: false, configurable: true });
e[0] = 7;
print("nw=" + e[0] + "," + e[2]);     // 99,30

// getter-only index: assignment silently ignored
var f = [0];
Object.defineProperty(f, "0", { get: function () { return 5; }, configurable: true });
f[0] = 123;
print("getonly=" + f[0]);             // 5

// iteration via map/forEach observes the deopted accessor index
var g = [1, 2, 3];
Object.defineProperty(g, "2", { get: function () { return 30; }, configurable: true });
print("map=" + g.map(function (x) { return x; }).join(","));  // 1,2,30

// Enumeration of deopted array indices (accessor / attributed) via @12.
function p(n, v) { print(n + "=" + v); }

// an enumerable deopted index shows up exactly once (not duplicated by the
// dense-loop + @12 emission) and reports propertyIsEnumerable true
var a = []; Object.defineProperty(a, "0", { enumerable: true });
p("pie-true", a.propertyIsEnumerable("0"));
var ks = []; for (var k in a) ks.push(k); p("forin", ks.join(","));
p("keys", Object.keys(a).join(","));

// a non-enumerable deopted index is excluded from keys/for-in but listed by
// getOwnPropertyNames; its getter still resolves on access
var b = [10, 20, 30];
Object.defineProperty(b, "1", { get: function () { return 99; }, enumerable: false, configurable: true });
p("pie-false", b.propertyIsEnumerable("1"));
p("b-keys", Object.keys(b).join(","));
p("b-get", b[1]);

// plain dense indices stay enumerable with no duplication
var c = [1, 2, 3]; var cks = []; for (var k2 in c) cks.push(k2); p("dense", cks.join(","));

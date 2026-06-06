// delete on deopted array indices (accessor / attributed-data in @12)
function p(n, v) { print(n + "=" + v); }

// configurable accessor index: delete removes it
var a = [1, 2, 3];
Object.defineProperty(a, "1", { get: function () { return 9; }, configurable: true });
var d1 = delete a[1];
p("acc", d1 + "," + ("1" in a) + "," + a[1]); // true,false,undefined

// configurable attributed-data index: delete removes it
var b = [1, 2, 3];
Object.defineProperty(b, "0", { value: 7, writable: false, configurable: true });
p("data", (delete b[0]) + "," + ("0" in b)); // true,false

// non-configurable index: delete fails (sloppy returns false), property stays
var c = [1, 2, 3];
Object.defineProperty(c, "2", { value: 7, configurable: false });
p("nonconf", (delete c[2]) + "," + ("2" in c)); // false,true

// plain dense element delete still works
var e = [10, 20, 30];
p("dense", (delete e[1]) + "," + ("1" in e) + ",len=" + e.length); // true,false,len=3

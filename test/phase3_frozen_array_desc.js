// A frozen/sealed array's dense elements report the right descriptor and
// resist delete.
function p(n, v) { print(n + "=" + v); }

var a = [1, 2, 3]; Object.freeze(a);
var d = Object.getOwnPropertyDescriptor(a, "0");
p("frozen-desc", d.writable + "," + d.configurable + "," + d.enumerable); // false,false,true
p("frozen-write", (a[0] = 99, a[0]));            // 1 (refused)
p("frozen-del", (delete a[0]) + "," + ("0" in a)); // false,true

var s = [1, 2, 3]; Object.seal(s);
var ds = Object.getOwnPropertyDescriptor(s, "0");
p("sealed-desc", ds.writable + "," + ds.configurable); // true,false
p("sealed-write", (s[0] = 7, s[0]));             // 7 (writable)
p("sealed-del", (delete s[0]) + "," + ("0" in s)); // false,true

// push/pop/shift/unshift throw when the array's length is locked.
function p(n, fn) { try { fn(); print(n + "=NO THROW"); } catch (e) { print(n + "=" + e.constructor.name); } }

var a = [1, 2]; Object.defineProperty(a, "length", { writable: false });
p("push-nwlen", function () { a.push(3); });   // TypeError
p("unshift-nwlen", function () { a.unshift(0); }); // TypeError

var b = [1, 2]; Object.freeze(b);
p("push-frozen", function () { b.push(3); });   // TypeError
p("pop-frozen", function () { b.pop(); });       // TypeError
p("shift-frozen", function () { b.shift(); });   // TypeError

var c = [1, 2, 3]; Object.seal(c);
p("pop-sealed", function () { c.pop(); });       // TypeError (element non-configurable)

// splice that changes length on a non-writable-length array throws,
// but an equal-count replacement (no length change) is allowed
var e = [0, 1, 2]; Object.defineProperty(e, "length", { writable: false });
p("splice-shrink", function () { e.splice(1, 2, 4); });  // TypeError
e.splice(1, 1, 9);
print("splice-equal=" + e.join(","));                     // 0,9,2

// normal arrays are unaffected
var d = [1, 2, 3];
print("normal=" + d.push(4) + "," + d.pop() + "," + d.shift() + "," + d.unshift(9) + "," + d.join(","));

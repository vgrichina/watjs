// push/pop/shift/unshift operate generically on array-like object receivers
// (reading/writing the receiver's indices + length, not a throwaway copy).
function p(n, v) { print(n + "=" + v); }

var o = { length: 0 };
p("push", Array.prototype.push.call(o, 1, 2) + "," + o.length + "," + o[0] + "," + o[1]); // 2,2,1,2

var a = { 0: "a", 1: "b", 2: "c", length: 3 };
p("pop", Array.prototype.pop.call(a) + "," + a.length + "," + ("2" in a)); // c,2,false

var b = { 0: "x", 1: "y", length: 2 };
p("shift", Array.prototype.shift.call(b) + "," + b.length + "," + b[0]); // x,1,y

var c = { 0: "a", 1: "b", length: 2 };
p("unshift", Array.prototype.unshift.call(c, "p", "q") + "," + c.length + "," + c[0] + "," + c[2]); // 4,4,p,a

// real arrays still work
var d = [1, 2, 3];
p("real", d.push(4) + "," + d.pop() + "," + d.shift() + "," + d.unshift(0) + "," + d.join(","));

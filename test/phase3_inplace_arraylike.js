// reverse/fill/copyWithin mutate a generic array-like object receiver in place.
function show(o) { var s = []; for (var i = 0; i < o.length; i++) s.push(i in o ? o[i] : "_"); return s.join(","); }
function p(n, v) { print(n + "=" + v); }

var o = { 0: "a", 1: "b", 2: "c", length: 3 };
Array.prototype.reverse.call(o); p("reverse", show(o)); // c,b,a

o = { 0: "a", 1: "b", 2: "c", length: 3 };
Array.prototype.fill.call(o, "Z", 1); p("fill", show(o)); // a,Z,Z

o = { 0: 1, 1: 2, 2: 3, 3: 4, length: 4 };
Array.prototype.copyWithin.call(o, 0, 2); p("copyWithin", show(o)); // 3,4,3,4

// real arrays unaffected
p("real-rev", [1, 2, 3].reverse().join(","));         // 3,2,1
p("real-fill", [1, 2, 3, 4].fill(0, 1, 3).join(","));  // 1,0,0,4
p("real-cw", [1, 2, 3, 4, 5].copyWithin(0, 3).join(",")); // 4,5,3,4,5

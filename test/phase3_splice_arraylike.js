// Array.prototype.splice on a generic array-like object receiver mutates it.
function mk() { return { 0: "a", 1: "b", 2: "c", 3: "d", length: 4 }; }
function show(o) { var s = []; for (var i = 0; i < o.length; i++) s.push(i in o ? o[i] : "_"); return s.join(",") + "|" + o.length; }
function p(n, v) { print(n + "=" + v); }

var o = mk(); var r = Array.prototype.splice.call(o, 1, 2, "X", "Y", "Z");
p("grow", JSON.stringify(r) + " " + show(o));   // ["b","c"] a,X,Y,Z,d|5
o = mk(); r = Array.prototype.splice.call(o, 1, 1);
p("shrink", JSON.stringify(r) + " " + show(o)); // ["b"] a,c,d|3
o = mk(); r = Array.prototype.splice.call(o, 1, 2, "X", "Y");
p("equal", JSON.stringify(r) + " " + show(o));  // ["b","c"] a,X,Y,d|4
o = mk(); r = Array.prototype.splice.call(o, 1);
p("toend", JSON.stringify(r) + " " + show(o));  // ["b","c","d"] a|1

// real arrays unaffected
var a = [1, 2, 3, 4, 5];
p("real", JSON.stringify(a.splice(1, 2, 9)) + " " + a.join(",")); // [2,3] 1,9,4,5

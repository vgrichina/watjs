// The Array iterator reads array.length live on each next() (not a snapshot),
// so growth/shrink during iteration is observed.
var arr = [0]; var seen = [];
for (var x of arr) { seen.push(x); if (x < 3) arr.push(x + 1); }
if (seen.join(",") !== "0,1,2,3") throw "expand: " + seen;

var a2 = [0,1,2,3,4]; var s2 = [];
for (var y of a2) { s2.push(y); if (y === 1) a2.length = 3; }
if (s2.join(",") !== "0,1,2") throw "contract: " + s2;

// values() iterator directly
var a3 = [10]; var it = a3.values();
if (it.next().value !== 10) throw "v0";
a3.push(20);
if (it.next().value !== 20) throw "v1 (grow not seen)";
if (it.next().done !== true) throw "done";

// normal iteration still correct
if ([1,2,3].join("|") !== "1|2|3") throw "basic";
var spread = [...[1,2,3]];
if (spread.join(",") !== "1,2,3") throw "spread";
print("ok");

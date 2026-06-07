// Sticky 'y' anchors the match exactly at lastIndex (no forward scan).
var r = /x/y;
if (r.exec("xxx").index !== 0 || r.lastIndex !== 1) throw new Error("sticky from 0");
var r2 = /x/y; r2.lastIndex = 1;
if (r2.exec("axx")[0] !== "x" || r2.lastIndex !== 2) throw new Error("sticky at 1");
var r3 = /x/y; r3.lastIndex = 0;
if (r3.exec("axx") !== null) throw new Error("sticky must not forward-scan");
if (r3.lastIndex !== 0) throw new Error("lastIndex reset on no match");
if (!/\d/y.test("5")) throw new Error("sticky test");
// sticky interacts with the @@match/@@replace protocol via RegExpExec→exec
if ("aaa".replace(/a/y, "-") !== "-aa") throw new Error("sticky replace");
print("ok");

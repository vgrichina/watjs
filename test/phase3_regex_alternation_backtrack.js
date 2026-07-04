// Alternation is a backtracking point: when an earlier (shorter) alternative matches but the
// continuation fails, the matcher must retry a later (longer) alternative.
function m(p, s) { var r = new RegExp(p).exec(s); return r ? r[0] : null; }
if (m("(a|ab)c", "abc") !== "abc") throw new Error("(a|ab)c");
if (m("(?:a|ab)c", "abc") !== "abc") throw new Error("(?:a|ab)c");
if (m("(foo|foobar)baz", "foobarbaz") !== "foobarbaz") throw new Error("foo|foobar");
if (m("(a|ab)(c|bc)", "abc") !== "abc") throw new Error("two groups");
if (m("(ab|a)c", "abc") !== "abc") throw new Error("(ab|a)c");   // longer-first still works
// capture reflects the winning alternative
var r = new RegExp("(a|ab)c").exec("abc");
if (r[1] !== "ab") throw new Error("capture should be the backtracked alternative, got " + r[1]);

// ES2025 duplicate named groups (same name in different alternatives): a captured group wins over
// a non-capturing same-name sibling; key order is RegExp source order.
var matcher = /(?:(?<x>a)|(?<y>a)(?<x>b))(?:(?<z>c)|(?<z>d))/;
var g = matcher.exec("abc").groups;
if (g.x !== "b" || g.y !== "a" || g.z !== "c") throw new Error("dup groups abc: " + JSON.stringify(g));
if (Object.keys(g).join() !== "x,y,z") throw new Error("group key order: " + Object.keys(g));
var g2 = matcher.exec("ad").groups;
if (g2.x !== "a" || g2.y !== undefined || g2.z !== "d") throw new Error("dup groups ad: " + JSON.stringify(g2));
print("ok");

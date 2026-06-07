// RegExp.prototype[@@replace] spec protocol: RegExpExec loop, captures/index/groups
// read from the result object, $-substitution and function replacers.
if ("aXbXc".replace(/X/g, "-") !== "a-b-c") throw new Error("global literal");
if ("abc".replace(/b/, "[$&]") !== "a[b]c") throw new Error("$&");
if ("2024-01".replace(/(\d+)-(\d+)/, "$2/$1") !== "01/2024") throw new Error("$1$2");
if ("aaa".replace(/a/g, "$$") !== "$$$") throw new Error("$$");
if ("xy".replace(/(?<a>x)/, "$<a>!") !== "x!y") throw new Error("$<name>");
if ("abc".replace(/z/, "X") !== "abc") throw new Error("no match");
// function replacer gets (match, ...caps, offset, string)
var got;
"a1b2".replace(/([a-z])(\d)/g, function (m, p1, p2, off, s) { got = [m, p1, p2, off, s]; return ""; });
if (got[0] !== "b2" || got[1] !== "b" || got[2] !== "2" || got[3] !== 2 || got[4] !== "a1b2") throw new Error("fn args " + got);
// custom exec drives the captures/index
var r = /o/g; var seq = [{ 0: "o", index: 1, length: 1 }, { 0: "o", index: 2, length: 1 }, null]; var i = 0;
r.exec = function () { return seq[i++]; };
if ("foo".replace(r, "0") !== "f00") throw new Error("custom exec");
print("ok");

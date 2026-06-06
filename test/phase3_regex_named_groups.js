// Named capture groups expose match.groups (null-prototype object).
function p(n, v) { print(n + "=" + v); }
var m = "2024-05".match(/(?<y>\d+)-(?<mo>\d+)/);
p("groups", m.groups.y + "," + m.groups.mo);    // 2024,05
p("indices", m[1] + "," + m[2]);                 // 2024,05
p("no-names", "ab".match(/(a)(b)/).groups);      // undefined
p("exec", /(?<x>\w)/.exec("z").groups.x);        // z
p("proto-null", Object.getPrototypeOf("a".match(/(?<g>a)/).groups)); // null
p("optional-unmatched", JSON.stringify("a".match(/(?<g>a)(?<h>b)?/).groups)); // {"g":"a"}

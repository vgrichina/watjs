// (?<name>...) captures as a (numbered) group; indices stay correct around it.
function p(n, v) { print(n + "=" + v); }
p("named", "2024".match(/(?<y>\d+)/)[1]);              // 2024
p("mixed", "ab".match(/(?<x>a)(b)/)[2]);               // b
p("after", "abc".match(/(?<x>a)(?<y>b)(c)/)[3]);       // c
p("plain", "ab".match(/(a)(b)/)[1]);                   // a
p("noncap", "abab".match(/(?:ab)+/)[0]);               // abab
p("named-backref", /(?<c>\w)\1/.test("aa"));           // true

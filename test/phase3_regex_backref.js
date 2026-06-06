// Backreferences \1..\9 match the text captured by the corresponding group.
function p(n, v) { print(n + "=" + v); }
p("dup", /(\w)\1/.test("aa"));               // true
p("dup-no", /(\w)\1/.test("ab"));            // false
p("word", "hello hello".match(/(\w+) \1/)[0]); // hello hello
p("cap", /(\w)\1/.exec("aa")[1]);            // a
p("ignorecase", /(\w)\1/i.test("aA"));       // true
p("two-groups", /(a)(b)\2\1/.test("abba"));  // true
p("class-unaffected", "abc".match(/\d/) === null); // true

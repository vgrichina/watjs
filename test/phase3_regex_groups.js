// Non-capturing groups (?:...) and lookahead (?=...)/(?!...).
function p(n, v) { print(n + "=" + v); }
p("noncap", "abab".match(/(?:ab)+/)[0]);            // abab
p("noncap-len", "abab".match(/(?:ab)+/).length);    // 1 (no capture)
p("lookahead", /a(?=b)/.test("ab"));                // true
p("lookahead-no", /a(?=b)/.test("ac"));             // false
p("neglook", /a(?!b)/.test("ac"));                  // true
p("neglook-no", /a(?!b)/.test("ab"));               // false
p("la-zerowidth", "ab".match(/a(?=b)/)[0]);         // a
p("cap-index", "xabc".match(/(?:x)(a)(b)/)[1]);     // a
p("plain-caps", "ab".match(/(a)(b)/)[2]);           // b
p("nested", "foobar".match(/(?:foo)(bar)/)[1]);     // bar

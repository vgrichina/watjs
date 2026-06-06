// Lookbehind (?<=...) / (?<!...) — zero-width, matches the body ending at the position.
function p(n, v) { print(n + "=" + v); }
p("pos", /(?<=a)b/.test("ab"));               // true
p("pos-no", /(?<=a)b/.test("xb"));            // false
p("neg", /(?<!a)b/.test("xb"));               // true
p("neg-no", /(?<!a)b/.test("ab"));            // false
p("variable", "$100".match(/(?<=\$)\d+/)[0]); // 100
p("global-repl", "a1b2".replace(/(?<=[a-z])\d/g, "#")); // a#b#
p("at-start", /(?<=^)a/.test("abc"));         // true
p("lookahead-still", /a(?=b)/.test("ab"));    // true

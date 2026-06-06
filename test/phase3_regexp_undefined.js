// RegExp(undefined)/RegExp() → empty source; match/search/replace(undefined) consistent.
function p(n, v) { print(n + "=" + v); }
p("ctor-undef", new RegExp(undefined).source);        // (?:)
p("ctor-empty", new RegExp().source);                 // (?:)
p("exec-undef", RegExp(undefined).exec("undefined")[0]); // "" (empty match)
p("match-noarg", JSON.stringify("abc".match()));       // [""]
p("match-undef", JSON.stringify("abc".match(undefined))); // [""]
p("search-noarg", "abc".search());                    // 0
p("copy", new RegExp(/ab+/).source);                  // ab+
p("normal", /\d/.test("a1"));                          // true

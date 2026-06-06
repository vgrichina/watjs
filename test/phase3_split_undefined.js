// split(undefined) returns [wholeString] — must NOT coerce undefined to "undefined".
function p(n, v) { print(n + "=" + v); }
p("undef-len", String("undefinedd").split(undefined).length);   // 1
p("undef-val", "undefinedd".split(undefined)[0]);                // undefinedd
p("abc", "abc".split(undefined)[0]);                             // abc
p("no-arg", "xyz".split().length);                               // 1
p("explicit-str", "undefinedd".split("undefined").length);       // 2 (still splits)
p("comma", "a,b,c".split(",").length);                           // 3
p("regex", "a1b".split(/\d/).join(","));                         // a,b

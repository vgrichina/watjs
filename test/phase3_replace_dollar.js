// $` (before match) and $' (after match) replacement patterns.
function p(n, v) { print(n + "=" + v); }
p("before", "abc".replace(/b/, "[$`]"));    // a[a]c
p("after", "abc".replace(/b/, "[$']"));      // a[c]c
p("both", "xByz".replace(/B/, "$`|$'"));     // xx|yzyz
p("group", "abcd".replace(/(b)(c)/, "$2$1")); // acbd
p("amp", "abc".replace(/b/, "<$&>"));         // a<b>c
p("all-before", "aXbXc".replaceAll("X", "[$`]")); // a[a]b[aXb]c

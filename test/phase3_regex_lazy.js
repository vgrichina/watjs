// Lazy (non-greedy) quantifiers: *? +? ?? {n,m}?
function p(n, v) { print(n + "=" + v); }
p("plus", "aaa".match(/a+?/)[0]);            // a
p("star-nomatch", "aaa".match(/a*?b/) === null); // true
p("star-match", "aaab".match(/a*?b/)[0]);    // aaab
p("tag", "<a><b>".match(/<.+?>/)[0]);        // <a>
p("brace", "aaaa".match(/a{1,3}?/)[0]);      // a
p("opt", "ab".match(/a??b/)[0]);             // ab
// greedy still works
p("greedy", "aaa".match(/a+/)[0]);           // aaa
p("greedy-tag", "<a><b>".match(/<.+>/)[0]);  // <a><b>

function p(n,v){print(n+"="+v);}
p("global-stateful", (function(){var r=/a/g;return [r.test("a"),r.test("a"),r.test("a")].join(",");})());
p("global-multi", (function(){var r=/a/g;return [r.test("aa"),r.test("aa"),r.test("aa")].join(",");})());
p("nonglobal-repeat", (function(){var r=/a/;return [r.test("a"),r.test("a")].join(",");})());
p("lastindex-track", (function(){var r=/o/g;r.test("foo");return r.lastIndex;})());
p("no-match-reset", (function(){var r=/x/g;r.test("abc");return r.lastIndex;})());
p("basic", /\d+/.test("abc123"));

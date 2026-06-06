// String.prototype.replaceAll: regex(global)/string search, $-substitution, callbacks.
function p(n, v) { print(n + "=" + v); }
p("basic", "aaa".replaceAll("a", "b"));               // bbb
p("none", "xyz".replaceAll("a", "b"));                // xyz
p("dollar-amp", "a-a".replaceAll("a", "[$&]"));       // [a]-[a]
p("regex-global", "a1a2".replaceAll(/a/g, "X"));      // X1X2
p("regex-nonglobal", (function () { try { "aa".replaceAll(/a/, "b"); return "no"; } catch (e) { return e.constructor.name; } })()); // TypeError
p("callback", "a.b".replaceAll(".", function () { return "_"; })); // a_b
p("empty-sep", "abc".replaceAll("", "-"));            // -a-b-c-
p("overlap", "aaa".replaceAll("aa", "b"));            // ba (non-overlapping)

// $<name> replacement + matchAll/.groups
function p(n, v) { print(n + "=" + v); }
p("named-repl", "2024-05".replace(/(?<y>\d+)-(?<m>\d+)/, "$<m>/$<y>")); // 05/2024
p("num-repl", "John Smith".replace(/(\w+) (\w+)/, "$2 $1"));            // Smith John
p("amp", "abc".replace(/b/, "[$&]"));                                   // a[b]c
p("matchAll", [..."x1y2".matchAll(/(?<d>\d)/g)].map(function (m) { return m.groups.d; }).join(",")); // 1,2
p("matchAll-index", [..."a1".matchAll(/(\d)/g)][0].index);             // 1

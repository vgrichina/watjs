function p(n,v){print(n+"="+v);}
p("flat-hole", JSON.stringify([1,,3].flat()));
p("flat-nested-hole", JSON.stringify([1,[2,,4]].flat()));
p("flat-deep", JSON.stringify([1,[2,[3]]].flat(2)));
p("split-cap", JSON.stringify("a1b2".split(/(\d)/)));
p("split-nocap", JSON.stringify("a1b2".split(/\d/)));
p("split-multicap", JSON.stringify("2024-01".split(/(\d+)(-)/)));
p("split-str", JSON.stringify("a-b-c".split("-")));

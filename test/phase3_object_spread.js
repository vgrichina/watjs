function p(n,v){print(n+"="+v);}
p("arr", JSON.stringify({...[1,2,3]}));
p("str", JSON.stringify({..."ab"}));
p("obj", JSON.stringify({...{a:1},...{b:2}}));
p("override", JSON.stringify({a:1,...{a:2}}));
p("null", JSON.stringify({...null}));
p("undef", JSON.stringify({x:1,...undefined}));
p("num", JSON.stringify({...5}));
p("nonenum", (function(){var o={};Object.defineProperty(o,"h",{value:1,enumerable:false});return JSON.stringify({...o});})());

function p(n,v){print(n+"="+v);}
p("arr-mem", (function(){var o={};[o.x,o.y]=[1,2];return o.x+","+o.y;})());
p("arr-idx", (function(){var a=[];[a[0],a[1]]=[3,4];return a[0]+","+a[1];})());
p("arr-chain", (function(){var o={p:{}};[o.p.x]=[9];return o.p.x;})());
p("arr-default", (function(){var o={};[o.x=7]=[];return o.x;})());
p("arr-rest", (function(){var o={};[o.a,...o.rest]=[1,2,3];return o.a+":"+o.rest.join(",");})());
p("arr-nested", (function(){var o={};[[o.x]]=[[8]];return o.x;})());
p("obj-mem", (function(){var o={};({x:o.y}={x:5});return o.y;})());
p("obj-def", (function(){var o={};({x:o.y=7}={});return o.y;})());
p("obj-idx", (function(){var a=[];({k:a[0]}={k:9});return a[0];})());
p("plain-arr", (function(){var a,b;[a,b]=[1,2];return a+","+b;})());
p("plain-obj", (function(){var a;({x:a}={x:3});return a;})());

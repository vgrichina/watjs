function p(n,v){print(n+"="+v);}
p("obj-identity", (function(){var o={a:1};return o.valueOf()===o;})());
p("obj-via-proto", (function(){var o=Object.create(null);return Object.prototype.valueOf.call(o)===o;})());
p("str-prim", "abc".valueOf());
p("num-prim", (42).valueOf());
p("number-obj-still-nan", Number({}));
p("obj-plus-string", ({})+"");

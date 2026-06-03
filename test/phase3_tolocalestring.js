function p(n,v){print(n+"="+v);}
p("num", (255).toLocaleString());
p("num-own", Number.prototype.hasOwnProperty("toLocaleString"));
p("arr", [1,2,3].toLocaleString());
p("arr-own", Array.prototype.hasOwnProperty("toLocaleString"));
p("obj", ({}).toLocaleString());
p("obj-own", Object.prototype.hasOwnProperty("toLocaleString"));
p("len", Object.prototype.toLocaleString.length);
p("is-fn", typeof [].toLocaleString);

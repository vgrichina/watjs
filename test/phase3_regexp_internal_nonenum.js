function p(n,v){print(n+"="+v);}
p("ctor-keys", JSON.stringify(Object.keys(new RegExp("ab","g"))));   // []
p("lit-keys", JSON.stringify(Object.keys(/xy/i)));                   // []
p("lastIndex-desc", (function(){ var d=Object.getOwnPropertyDescriptor(/a/,"lastIndex"); return d.writable+","+d.enumerable+","+d.configurable; })()); // true,false,false
p("source", /ab/g.source);                                          // ab
p("flags", /ab/gi.flags);                                           // gi
p("stateful", (function(){ var g=/a/g; g.exec("aa"); return g.lastIndex; })()); // 1
p("assign-from-regex", (function(){ var o=Object.assign({}, /x/g); return JSON.stringify(Object.keys(o)); })()); // []

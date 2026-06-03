function p(n,v){print(n+"="+v);}
var s = Symbol("k");
var o = {};
o[s] = 42;
p("before", o[s]);
p("has-before", s in o);
p("delete-ret", delete o[s]);
p("after", o[s]);
p("has-after", s in o);
// string keys still work
var o2 = {a:1};
p("str-delete", delete o2.a);
p("str-after", o2.a);
// non-configurable symbol prop: delete returns false
var o3 = {};
Object.defineProperty(o3, s, {value:7, configurable:false});
p("nonconf-delete", delete o3[s]);
p("nonconf-still", o3[s]);
// well-known symbol delete
p("reflect-tag-del", delete Reflect[Symbol.toStringTag]);
p("reflect-tag-after", Reflect[Symbol.toStringTag]);

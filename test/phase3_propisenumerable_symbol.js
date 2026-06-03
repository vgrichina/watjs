function p(n,v){print(n+"="+v);}
var s = Symbol("k");
var o = {}; o[s] = 1;
p("enum-sym", o.propertyIsEnumerable(s));        // true
var o2 = {};
Object.defineProperty(o2, s, {value:2, enumerable:false});
p("nonenum-sym", o2.propertyIsEnumerable(s));    // false
p("absent-sym", o.propertyIsEnumerable(Symbol("other"))); // false
o.a = 5;
p("enum-str", o.propertyIsEnumerable("a"));      // true

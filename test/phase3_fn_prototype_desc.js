function p(n,v){print(n+"="+v);}
function attrs(o,k){ var d=Object.getOwnPropertyDescriptor(o,k); return d?(d.writable+","+d.enumerable+","+d.configurable):"undefined"; }
function f(){}
p("fn-proto", attrs(f, "prototype"));        // true,false,false
function* g(){}
p("gen-proto", attrs(g, "prototype"));        // true,false,false
class C{}
p("class-proto", attrs(C, "prototype"));      // false,false,false
p("fn-proto-value", f.prototype === Object.getOwnPropertyDescriptor(f,"prototype").value); // true
p("has-proto-own", f.hasOwnProperty("prototype")); // true

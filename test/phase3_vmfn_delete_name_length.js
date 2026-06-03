function p(n,v){print(n+"="+v);}
function f(){}
p("name-before", f.name);                 // f
p("name-del", delete f.name);             // true
p("name-hasOwn", f.hasOwnProperty("name")); // false (own prop removed)
p("name-desc", Object.getOwnPropertyDescriptor(f, "name")); // undefined (no own)
function g(a,b){}
p("len-del", delete g.length);            // true
p("len-hasOwn", g.hasOwnProperty("length")); // false
p("len-desc", Object.getOwnPropertyDescriptor(g, "length")); // undefined
// independent function keeps its own name/length
function h(x){}
p("other", h.name + "/" + h.length);      // h/1
p("other-hasOwn", h.hasOwnProperty("name") && h.hasOwnProperty("length")); // true

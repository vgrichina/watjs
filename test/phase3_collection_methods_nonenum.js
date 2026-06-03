function p(n,v){print(n+"="+v);}
p("map-keys", JSON.stringify(Object.keys(new Map())));     // []
p("set-keys", JSON.stringify(Object.keys(new Set())));     // []
p("promise-keys", JSON.stringify(Object.keys(Promise.resolve(1)))); // []
// methods still work
var m=new Map(); m.set("a",1); p("map-works", m.get("a")+","+m.size);
var s=new Set([1,2,2]); p("set-works", s.has(2)+","+s.size);
p("promise-works", typeof Promise.resolve(1).then);
// JSON.stringify of a Map is {} (no own enumerable props)
p("map-json", JSON.stringify(new Map()));                  // {}
// for-in over a Map yields nothing
var fk=[]; for(var k in new Map()) fk.push(k); p("map-forin", JSON.stringify(fk)); // []

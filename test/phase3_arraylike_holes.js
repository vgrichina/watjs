function p(n,v){print(n+"="+v);}
var a = { length: 3, 0:1, 2:21 };  // index 1 absent
p("forEach-sum", (function(){ var s=0; Array.prototype.forEach.call(a, function(e){ s+=e; }); return s; })()); // 22 (skips 1)
p("filter-len", Array.prototype.filter.call(a, function(){ return true; }).length); // 2
p("map-len", Array.prototype.map.call(a, function(e){ return e; }).length); // 3 (preserves length)
p("some", Array.prototype.some.call(a, function(e){ return e===undefined; })); // false (absent skipped)
p("indexOf-undef", Array.prototype.indexOf.call(a, undefined)); // -1
// real-array holes unchanged
p("real-filter", [1,,3].filter(function(){ return true; }).length); // 2
// Array.from still fills undefined (does NOT skip)
p("from-len", Array.from(a).length);   // 3
p("from-fill", Array.from({length:2}).join("|")); // "|" (two undefineds)

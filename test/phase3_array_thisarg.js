function p(n,v){print(n+"="+v);}
var ctx={f:10};
p("map", [1,2].map(function(v){return v*this.f;},ctx).join(","));
p("forEach", (function(){var s=0;[1,2].forEach(function(v){s+=v*this.f;},ctx);return s;})());
p("filter", [1,2,3].filter(function(v){return v*this.f>15;},ctx).join(","));
p("some", [1,2].some(function(v){return v*this.f>15;},ctx));
p("every", [1,2].every(function(v){return v*this.f>0;},ctx));
p("find", [1,2,3].find(function(v){return v*this.f>15;},ctx));
p("findIndex", [1,2,3].findIndex(function(v){return v*this.f>15;},ctx));
p("no-thisarg", [1,2].map(function(v){return v*2;}).join(","));
var c2={f:100};
p("map-fe", (function(){var s=0;new Map([["a",1],["b",2]]).forEach(function(v){s+=v*this.f;},c2);return s;})());
p("set-fe", (function(){var s=0;new Set([1,2]).forEach(function(v){s+=v*this.f;},c2);return s;})());

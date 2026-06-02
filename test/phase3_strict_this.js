function p(n,v){print(n+"="+v);}
p("plain-call-undef", (function(){ "use strict"; function f(){return this;} return f()===undefined; })());
p("sloppy-global", (function(){ function f(){return this;} return typeof f()==="object"; })());
p("method-receiver", (function(){ "use strict"; var o={v:5,m(){return this.v;}}; return o.m(); })());
p("nested-inherits", (function(){ "use strict"; function o(){ function i(){return this;} return i(); } return o()===undefined; })());
p("this-prop-throws", (function(){ "use strict"; function f(){this.x=1;} try{f();return "no";}catch(e){return e.name;} })());
p("call-with-this", (function(){ "use strict"; function f(){return this.v;} return f.call({v:7}); })());
p("strict-callback-this", (function(){ "use strict"; var r; [1].forEach(function(){r=this;}); return r===undefined; })());
p("strict-callback-thisArg", (function(){ "use strict"; var r; [1].forEach(function(){r=this.v;},{v:9}); return r; })());
p("sloppy-callback-global", (function(){ var r; [1].forEach(function(){r=this;}); return typeof r==="object"; })());

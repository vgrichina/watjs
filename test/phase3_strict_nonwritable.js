function p(n,v){print(n+"="+v);}
function t(n,f){ try{ f(); p(n,"NO-THROW"); }catch(e){ p(n,e.name); } }
t("assign-frozen", function(){ "use strict"; var o=Object.freeze({x:1}); o.x=2; });
t("assign-getter-only", function(){ "use strict"; var o={get x(){return 1;}}; o.x=5; });
t("assign-nonwritable", function(){ "use strict"; var o={}; Object.defineProperty(o,"x",{value:1,writable:false}); o.x=2; });
t("add-nonextensible", function(){ "use strict"; var o=Object.preventExtensions({}); o.y=1; });
t("assign-index-frozen", function(){ "use strict"; var a=Object.freeze([1,2]); a[0]=9; });
p("sloppy-frozen-noop", (function(){ var o=Object.freeze({x:1}); o.x=2; return o.x; })());
p("sloppy-nonwritable-noop", (function(){ var o={}; Object.defineProperty(o,"x",{value:1,writable:false}); o.x=2; return o.x; })());
p("strict-writable-ok", (function(){ "use strict"; var o={x:1}; o.x=2; return o.x; })());
p("strict-new-prop-ok", (function(){ "use strict"; var o={}; o.y=5; return o.y; })());

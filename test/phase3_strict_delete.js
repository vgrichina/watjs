function p(n,v){print(n+"="+v);}
function t(n,f){ try{ p(n,f()); }catch(e){ p(n,"THROW:"+e.name); } }
t("delete-nonconfig", function(){ "use strict"; var o={}; Object.defineProperty(o,"x",{value:1,configurable:false}); return delete o.x; });
t("delete-config-ok", function(){ "use strict"; var o={x:1}; return delete o.x; });
t("delete-nonexistent-ok", function(){ "use strict"; var o={}; return delete o.y; });
t("delete-frozen", function(){ "use strict"; var o=Object.freeze({x:1}); return delete o.x; });
t("delete-idx-nonconfig", function(){ "use strict"; var o={}; Object.defineProperty(o,"5",{value:1,configurable:false}); return delete o[5]; });
t("sloppy-nonconfig-false", function(){ var o={}; Object.defineProperty(o,"x",{value:1,configurable:false}); return delete o.x; });

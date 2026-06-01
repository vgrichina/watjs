function t(n,f){ try{ f(); print(n+"=OK"); }catch(e){ print(n+"="+e.name); } }
t("date-props", function(){ var o={}; var props=new Date(0); Object.defineProperty(props,"prop",{get:function(){return {value:5};},enumerable:true}); Object.defineProperties(o,props); if(o.prop!==5) throw new Error("bad"); });
t("normal", function(){ var o={}; Object.defineProperties(o,{a:{value:1,enumerable:true},b:{value:2}}); if(o.a!==1||o.b!==2) throw new Error("bad"); });
t("create", function(){ var o=Object.create(null,{p:{value:9}}); if(o.p!==9) throw new Error("bad"); });

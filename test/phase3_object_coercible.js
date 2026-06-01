function t(n,f){ try{ f(); print(n+"=NOTHROW"); }catch(e){ print(n+"="+(e instanceof TypeError?"TE":e.name)); } }
t("gops-undef", function(){ Object.getOwnPropertySymbols(undefined); });
t("gops-null", function(){ Object.getOwnPropertySymbols(null); });
t("fromEntries-undef", function(){ Object.fromEntries(undefined); });
t("fromEntries-num", function(){ Object.fromEntries(5); });
t("gops-obj-ok", function(){ var s=Symbol("x"); var o={}; o[s]=1; if(Object.getOwnPropertySymbols(o).length!==1) throw new Error("bad"); });
t("fromEntries-ok", function(){ var o=Object.fromEntries([["a",1],["b",2]]); if(o.a!==1||o.b!==2) throw new Error("bad"); });

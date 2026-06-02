function t(n,f){ try{ f(); print(n+"=NOTHROW"); }catch(e){ print(n+"="+(e instanceof TypeError?"TE":e.name)); } }
t("empty-null", function(){ var []=null; });
t("empty-undef", function(){ var []=undefined; });
t("empty-num", function(){ var []=5; });
t("empty-bool", function(){ var []=true; });
t("nonempty-null", function(){ var [a]=null; });
t("forof-null", function(){ for(var x of null){} });
t("forof-num", function(){ for(var x of 5){} });
t("forof-emptyptn-null", function(){ for([] of [null]){} });
t("plain-arr-ok", function(){ var [a,b]=[1,2]; if(a!==1) throw new Error("x"); });
t("gen-iter-ok", function(){ function*g(){yield 1;} var s=0; for(var x of g())s+=x; if(s!==1) throw new Error("x"); });
t("spread-null", function(){ return [...null]; });
t("spread-num", function(){ return [...5]; });
t("spread-undef", function(){ return [...undefined]; });
t("spread-arr-ok", function(){ var x=[...[1,2],...[3]]; if(x.length!==3) throw new Error("x"); });
t("spread-str-ok", function(){ var x=[..."ab"]; if(x.length!==2) throw new Error("x"); });

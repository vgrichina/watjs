function p(n,v){print(n+"="+v);}
Function.prototype.tag = "FP";
var f = function(){};
p("inherited-get", f.tag);
p("inherited-in", ("tag" in f));
p("own-shadows", (function(){ var g=function(){}; g.tag="own"; return g.tag; })());
p("absent", (f.nope === undefined));
p("absent-in", ("nope" in f));
var obj = {};
Object.defineProperty(obj, "k", f);   // descriptor's "value" is inherited (undefined here, but "value" not present → no value)
p("def-from-fn-desc", (typeof obj.k));
delete Function.prototype.tag;

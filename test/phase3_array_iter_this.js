function t(name,f){ try{ f(); print(name+"=NOTHROW"); }catch(e){ print(name+"="+(e instanceof TypeError?"TE":e.name)); } }
t("entries-undef", function(){ Array.prototype.entries.call(undefined); });
t("keys-null", function(){ Array.prototype.keys.call(null); });
t("values-undef", function(){ Array.prototype.values.call(undefined); });
// still works on real arrays
var it = [10,20].entries().next();
print("ok-entry=" + it.value[0] + "," + it.value[1]);
print("ok-keys=" + [5,6].keys().next().value);
print("ok-values=" + [7,8].values().next().value);

// Object.keys/values/assign over a function enumerate its own enumerable props
// (functions can carry data props: fn.a = 1). Previously returned [].
var fn = function(){}; fn.a = 1; fn.b = 2;
if (Object.keys(fn).join(",") !== "a,b") throw "keys: "+Object.keys(fn);
if (Object.values(fn).join(",") !== "1,2") throw "values";
var t = {}; Object.assign(t, fn);
if (Object.keys(t).join(",") !== "a,b") throw "assign";
var arrow = () => {}; arrow.x = 9;
if (Object.keys(arrow).join(",") !== "x") throw "arrow";
print("ok");

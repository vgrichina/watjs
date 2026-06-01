function flat(s){ return s.split("\n").join("|"); }
var ctrlstr = "\b\f\n\r\t";
print("compact=" + JSON.stringify({b:2,a:1}));
print("arr=" + JSON.stringify([1,"x",true,null]));
print("undef=" + JSON.stringify([undefined,function(){}]));
print("space2=" + flat(JSON.stringify({a:1,b:[2,3]}, null, 2)));
print("spacestr=" + flat(JSON.stringify([1,2], null, "->")));
print("wlist=" + JSON.stringify({a:1,b:2,c:3}, ["a","c"]));
print("repfn=" + JSON.stringify({a:1,b:2}, function(k,v){ return k==="b"?undefined:v; }));
print("repmul=" + JSON.stringify({a:1,b:2}, function(k,v){ return typeof v==="number"?v*10:v; }));
print("tojson=" + JSON.stringify({toJSON:function(){return "C";}}));
print("wrapNum=" + JSON.stringify(new Number(5)));
print("wrapStr=" + JSON.stringify(new String("hi")));
print("ctrl=" + JSON.stringify(ctrlstr));
var o={}; o.self=o;
print("circular=" + (function(){ try{ JSON.stringify(o); return "NO"; }catch(e){ return e.name; } })());

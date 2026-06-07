function tc(f){try{return "ok:"+f();}catch(e){return e.constructor.name;}}
var k1={},k2={};
var wm=new WeakMap([[k1,1],[k2,2]]); print(wm.get(k1)+","+wm.get(k2));
print(tc(function(){return new WeakMap([[5,1]]);}));
var ws=new WeakSet([k1,k2]); print(ws.has(k1));
print(tc(function(){return new WeakSet([5]);}));
print(new WeakMap().has(k1));

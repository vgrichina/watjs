// for-in must enumerate INHERITED enumerable string keys up the prototype chain,
// deduped, with non-enumerable own props shadowing inherited enumerable ones.
function P(){} P.prototype.inh = 5;
var o = new P(); o.own = 1;
var k = []; for (var p in o) k.push(p); k.sort();
if (k.join(",") !== "inh,own") throw "ctor chain: "+k;

var base = {x:1}; var d = Object.create(base); d.y = 2;
var k2 = []; for (var p in d) k2.push(p); k2.sort();
if (k2.join(",") !== "x,y") throw "create chain: "+k2;

// inherited enumerable accessor
var b2 = {}; Object.defineProperty(b2,"acc",{get:function(){return 1;},enumerable:true,configurable:true});
var d2 = Object.create(b2); d2.z = 3;
var k3 = []; for (var p in d2) k3.push(p); k3.sort();
if (k3.join(",") !== "acc,z") throw "inherited accessor: "+k3;

// non-enumerable own shadows inherited enumerable
var base3 = {}; Object.defineProperty(base3,"s",{value:1,enumerable:true,configurable:true});
var d3 = Object.create(base3); Object.defineProperty(d3,"s",{value:2,enumerable:false,configurable:true});
var k4 = []; for (var p in d3) k4.push(p);
if (k4.indexOf("s") !== -1) throw "shadow failed: "+k4;

// boolean primitive boxes → enumerates Boolean.prototype enumerable props
Object.defineProperty(Boolean.prototype,"bp",{get:function(){return 1;},enumerable:true,configurable:true});
var found = false; for (var p in false) if (p === "bp") found = true;
if (!found) throw "boolean primitive for-in";
delete Boolean.prototype.bp;
print("ok");

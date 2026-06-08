// defineProperty get/set on a (user) FUNCTION object's named property must invoke
// the accessor — previously the raw boxed descriptor leaked as garbage and the
// setter was overwritten. (Mirrors the array named-accessor fix.)
var f = function(){};
Object.defineProperty(f,"prop",{get:function(){return 42;},enumerable:true,configurable:true});
if (f.prop !== 42) throw "fn getter: "+f.prop;
var stored;
Object.defineProperty(f,"acc",{get:function(){return stored;},set:function(v){stored=v;},configurable:true});
f.acc = 7;
if (stored !== 7) throw "fn setter";
if (f.acc !== 7) throw "fn getter after set";
// Object.defineProperties with a function as the Properties arg (getter returns a descriptor)
var obj = {}, called = false;
var props = function(){};
Object.defineProperty(props,"p",{get:function(){called=true;return {value:9,enumerable:true};},enumerable:true});
Object.defineProperties(obj, props);
if (!called) throw "descriptor getter not invoked";
if (obj.p !== 9) throw "defined value: "+obj.p;
print("ok");

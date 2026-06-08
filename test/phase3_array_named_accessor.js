// defineProperty get/set on an array NAMED (non-index) property must invoke the
// accessor on read/write — previously the raw boxed descriptor leaked as garbage.
var arr=[0,1,2,3], stored;
Object.defineProperty(arr,"property",{
  get:function(){return stored===undefined?12:stored;},
  set:function(v){stored=v;},
  enumerable:true, configurable:true });
if (arr.property !== 12) throw "getter not invoked: "+arr.property;
arr.property = 42;
if (stored !== 42) throw "setter not invoked";
if (arr.property !== 42) throw "getter after set";
// plain data named props still reassign / respect writable
arr.foo=5; arr.foo=10; if (arr.foo!==10) throw "data reassign";
Object.defineProperty(arr,"ro",{value:7,writable:false,configurable:true});
arr.ro=99; if (arr.ro!==7) throw "non-writable respected";
print("ok");

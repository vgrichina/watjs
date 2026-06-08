// A function (or bound function, or primitive symbol) reading a property that is an
// INHERITED accessor (e.g. defined on Function.prototype) must invoke the getter,
// not return the raw boxed descriptor.
Object.defineProperty(Function.prototype, "prop", { get: function(){ return 12; }, configurable: true });
function foo(){}
if (foo.prop !== 12) throw "fn inherited getter: " + foo.prop;
if (foo.bind({}).prop !== 12) throw "bound fn inherited getter";
if (Math.max.prop !== 12) throw "native fn inherited getter";
delete Function.prototype.prop;
// inherited DATA props still work
Function.prototype.tag = "T";
if (foo.tag !== "T") throw "inherited data";
delete Function.prototype.tag;
// inherited setter fires
var stored;
Object.defineProperty(Function.prototype, "acc", { get: function(){ return stored; }, set: function(v){ stored = v; }, configurable: true });
foo.acc = 7;
if (foo.acc !== 7) throw "inherited setter";
delete Function.prototype.acc;
print("ok");

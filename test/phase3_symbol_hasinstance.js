// Function.prototype[Symbol.hasInstance] is the default OrdinaryHasInstance method.
if (typeof Function.prototype[Symbol.hasInstance] !== 'function') throw "method missing";
var d = Object.getOwnPropertyDescriptor(Function.prototype, Symbol.hasInstance);
if (d.writable !== false || d.enumerable !== false || d.configurable !== false) throw "attrs: "+JSON.stringify(d);
// it implements OrdinaryHasInstance
function F(){} var o = new F();
if (Function.prototype[Symbol.hasInstance].call(F, o) !== true) throw "method true";
if (Function.prototype[Symbol.hasInstance].call(F, {}) !== false) throw "method false";
// non-callable this → false
if (Function.prototype[Symbol.hasInstance].call({}, o) !== false) throw "non-callable false";
// instanceof operator still works (uses the default)
if (!(o instanceof F)) throw "op true";
if (!([] instanceof Array)) throw "array";
if (!(o instanceof Object)) throw "object";
if (({}) instanceof F) throw "op false";
// custom Symbol.hasInstance overrides
var C = function(){};
Object.defineProperty(C, Symbol.hasInstance, {value: function(x){ return x === 42; }});
if (!(42 instanceof C)) throw "custom true";
if ({} instanceof C) throw "custom false";
// bound function
var B = F.bind(null);
if (!(new B() instanceof F)) throw "bound";
print("ok");

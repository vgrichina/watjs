// new.target threading through Reflect.construct / proxy / bound functions.
function Base(){ this.nt = new.target; }
// direct new → new.target === Base
if ((new Base()).nt !== Base) throw "direct new.target";
// plain call → new.target undefined
var plain; (function f(){ plain = new.target; })(); if (plain !== undefined) throw "plain new.target";
// Reflect.construct with explicit newTarget
function NT(){}
var o = Reflect.construct(Base, [], NT);
if (o.nt !== NT) throw "Reflect.construct newTarget: "+o.nt;
// Reflect.construct without newTarget → defaults to target
if (Reflect.construct(Base, []).nt !== Base) throw "default newTarget";
// instance prototype derives from newTarget
if (Object.getPrototypeOf(Reflect.construct(Base, [], NT)) !== NT.prototype) throw "proto from newTarget";
// proxy construct trap receives newTarget as 3rd arg
var seen;
var P = new Proxy(Base, { construct: function(t, args, nt){ seen = nt; return Reflect.construct(t, args, nt); } });
var r = Reflect.construct(P, [], NT);
if (seen !== NT) throw "proxy trap newTarget: "+seen;
if (r.nt !== NT) throw "proxy forwards newTarget";
// proxy with no construct trap forwards to target, new.target = proxy under `new P()`
var P2 = new Proxy(Base, {});
if ((new P2()).nt !== P2) throw "new proxy → new.target is proxy";
// bound function: new.target retargets
var B = Base.bind(null);
if (!((new B()) instanceof Base)) throw "bound construct";
print("ok");

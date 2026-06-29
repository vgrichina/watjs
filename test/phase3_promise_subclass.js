// Subclassing Promise: super() (synthesized and explicit) into the native base ctor
// produces a working promise instance with the subclass prototype.
var log = [];

// synthesized derived ctor
class P1 extends Promise {}
var p1 = new P1(function(res){ res("a"); });
if (!(p1 instanceof P1)) throw "P1 not instanceof";
if (!(p1 instanceof Promise)) throw "P1 not Promise";
p1.then(function(v){ log.push("p1:" + v); });

// explicit super with extra init
class P2 extends Promise {
  constructor(ex){ super(ex); this.tag = "T"; }
}
var p2 = new P2(function(res){ res("b"); });
if (p2.tag !== "T") throw "P2 init lost";
if (!(p2 instanceof P2)) throw "P2 not instanceof";
p2.then(function(v){ log.push("p2:" + v + p2.tag); });

// then on a subclass instance returns a subclass instance (species), and chains
var chained = new P1(function(res){ res(1); }).then(function(v){ return v + 1; });
if (!(chained instanceof P1)) throw "chained not P1 (species)";
chained.then(function(v){ log.push("chain:" + v); });

// rejection path through a subclass
class P3 extends Promise {}
new P3(function(res, rej){ rej("e"); }).catch(function(e){ log.push("p3:" + e); });

// direct Promise unaffected
new Promise(function(res){ res("d"); }).then(function(v){ log.push("direct:" + v); });

// drain and verify
var d = Promise.resolve();
for (var i = 0; i < 10; i++) d = d.then(function(){});
d.then(function(){
  var want = ["chain:2","direct:d","p1:a","p2:bT","p3:e"].sort().join(",");
  var got = log.slice().sort().join(",");
  if (got !== want) throw "subclass mismatch: [" + got + "]";
  print("ok");
});

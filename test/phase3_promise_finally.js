// Promise.prototype.finally: onFinally runs on settle; value/reason pass through;
// non-callable onFinally is forwarded; a rejected onFinally result overrides.
var ran = [];
var checks = [];

Promise.resolve("V").finally(function(){ ran.push("f1"); })
  .then(function(v){ checks.push(v === "V" ? "v-ok" : "v-BAD:" + v); });

Promise.reject("E").finally(function(){ ran.push("f2"); })
  .then(function(){ checks.push("r-BAD-resolved"); },
        function(e){ checks.push(e === "E" ? "r-ok" : "r-BAD:" + e); });

Promise.resolve(1).finally(42)   // non-callable → passes through
  .then(function(v){ checks.push(v === 1 ? "nf-ok" : "nf-BAD:" + v); });

Promise.resolve(2).finally(function(){ return Promise.reject("OVR"); })
  .then(function(){ checks.push("o-BAD-resolved"); },
        function(e){ checks.push(e === "OVR" ? "o-ok" : "o-BAD:" + e); });

// finally on a non-object throws synchronously
var threw = false;
try { Promise.prototype.finally.call(5, function(){}); } catch(e){ threw = e instanceof TypeError; }
checks.push(threw ? "nonobj-ok" : "nonobj-BAD");

// drain enough microtask ticks, then verify
var p = Promise.resolve();
for (var i = 0; i < 12; i++) p = p.then(function(){});
p.then(function(){
  var want = ["v-ok","r-ok","nf-ok","o-ok","nonobj-ok"].sort().join(",");
  var got = checks.slice().sort().join(",");
  if (got !== want) throw "finally mismatch: got [" + got + "] ran=[" + ran.join(",") + "]";
  print("ok");
});

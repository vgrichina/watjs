// A present non-callable get/set proxy trap throws TypeError (was silently forwarding).
function thr(op){ var t=false; try{ op(); }catch(e){ t = e instanceof TypeError; } return t; }
if (!thr(function(){ (new Proxy({}, { get: 5 })).x; })) throw "get trap not callable";
if (!thr(function(){ (new Proxy({}, { set: 5 })).x = 1; })) throw "set trap not callable";
// callable traps work
if ((new Proxy({a:2}, { get: function(t,k){ return t[k]*5; } })).a !== 10) throw "callable get";
var t = {}; (new Proxy(t, { set: function(tg,k,v){ tg[k]=v*2; return true; } })).b = 3;
if (t.b !== 6) throw "callable set";
// absent traps forward to target
if ((new Proxy({c:9}, {})).c !== 9) throw "absent get forwards";
var t2 = {}; (new Proxy(t2, {})).d = 4; if (t2.d !== 4) throw "absent set forwards";
print("ok");

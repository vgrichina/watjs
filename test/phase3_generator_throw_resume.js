var log=[];
function* g(){ try { yield 1; log.push("no-throw-path"); } catch(e){ log.push("caught:"+e); yield 2; } log.push("after"); }
// throw caught by in-body catch → resumes, yields 2
var it=g();
if (it.next().value !== 1) throw "n1";
if (it.throw("E").value !== 2) throw "throw-caught";
if (it.next().done !== true) throw "complete";
if (log.join(",") !== "caught:E,after") throw "log:"+log.join(",");
// throw through try/finally (no catch) → finally runs, propagates, closes
var f=[];
function* g2(){ try { yield 1; } finally { f.push("fin"); } }
var it2=g2(); it2.next();
var threw=false; try { it2.throw("X"); } catch(e){ threw=(e==="X"); }
if (!threw) throw "not-propagated";
if (f.join() !== "fin") throw "finally:"+f.join();
if (!it2.next().done) throw "closed";
// throw into a COMPLETED generator → re-throws to caller
var it3=g2(); it3.next(); var r=it3.return(0);  // close it via return
var t2=false; try { it3.throw("D"); } catch(e){ t2=(e==="D"); }
if (!t2) throw "throw-into-done";
print("ok");

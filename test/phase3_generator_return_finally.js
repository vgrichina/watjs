var inFin=0, unreachable=0;
function* g(){ try { yield 1; unreachable++; } finally { inFin++; } unreachable++; }
var it=g();
if (it.next().value !== 1) throw "n1";
var r=it.return(45);
if (r.value !== 45) throw "ret-value:"+r.value;
if (r.done !== true) throw "ret-done";
if (inFin !== 1) throw "finally-not-run:"+inFin;
if (unreachable !== 0) throw "unreachable-ran:"+unreachable;
if (it.next().done !== true) throw "not-complete";

// finally that itself returns overrides the return value
function* g2(){ try { yield 1; } finally { return 99; } }
var it2=g2(); it2.next();
var r2=it2.return(7);
if (r2.value !== 99) throw "override-value:"+r2.value;
if (r2.done !== true) throw "override-done";

// nested try/finally: both finallys run, outer→inner order
var order=[];
function* g3(){ try { try { yield 1; } finally { order.push("inner"); } } finally { order.push("outer"); } }
var it3=g3(); it3.next();
var r3=it3.return(5);
if (r3.value !== 5) throw "nested-value:"+r3.value;
if (order.join(",") !== "inner,outer") throw "nested-order:"+order.join(",");

// return on a generator NOT in a try → plain completion (unchanged behavior)
function* g4(){ yield 1; yield 2; }
var it4=g4(); it4.next();
var r4=it4.return(8);
if (r4.value !== 8 || r4.done !== true) throw "plain-return";
if (it4.next().done !== true) throw "plain-closed";

// finally with a yield: return suspends in the finally, then completes
var fy=[];
function* g5(){ try { yield 1; } finally { fy.push("a"); yield 2; fy.push("b"); } }
var it5=g5(); it5.next();
var r5=it5.return(3);
if (r5.value !== 2 || r5.done !== false) throw "finally-yield:"+r5.value+"/"+r5.done;
print("ok");

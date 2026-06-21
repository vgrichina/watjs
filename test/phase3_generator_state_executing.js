// next/return/throw method lengths are 1
function* g0(){}
var GP = Object.getPrototypeOf(g0).prototype;
if (GP.next.length !== 1) throw "next.length:"+GP.next.length;
if (GP.return.length !== 1) throw "return.length:"+GP.return.length;
if (GP.throw.length !== 1) throw "throw.length:"+GP.throw.length;

// resuming a generator that is currently executing → TypeError, and it becomes completed
var iter;
function* g(){ iter.next(); }
iter = g();
var threw = false;
try { iter.next(); } catch(e){ threw = (e instanceof TypeError); }
if (!threw) throw "next-reentry-not-TypeError";
// now completed: a subsequent next() returns {value:undefined, done:true}
var r = iter.next();
if (r.value !== undefined || r.done !== true) throw "not-completed:"+JSON.stringify(r);

// return while executing → TypeError
var iter2;
function* g2(){ iter2.return(1); }
iter2 = g2();
var t2 = false;
try { iter2.next(); } catch(e){ t2 = (e instanceof TypeError); }
if (!t2) throw "return-reentry-not-TypeError";

// throw while executing → TypeError
var iter3;
function* g3(){ iter3.throw("x"); }
iter3 = g3();
var t3 = false;
try { iter3.next(); } catch(e){ t3 = (e instanceof TypeError); }
if (!t3) throw "throw-reentry-not-TypeError";

// a normal (non-reentrant) generator is unaffected
function* g4(){ yield 1; yield 2; }
var it4 = g4();
if (it4.next().value !== 1) throw "g4-1";
if (it4.next().value !== 2) throw "g4-2";
if (!it4.next().done) throw "g4-done";
print("ok");

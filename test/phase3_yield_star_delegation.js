// sync yield* delegates next/throw/return to the inner iterator
var rc=0, nc=0, tc=0;
var iterable={};
function mkIter(retVal){
  iterable[Symbol.iterator]=function(){
    return { next(){ nc++; return {done:false,value:"v"}; },
             return(x){ rc++; return retVal===undefined?{done:true,value:"iter.return"}:retVal; } };
  };
}
function* y(){ yield* iterable; }

// next forwarding: resume value reaches inner.next
var fwd=null;
var ity={};
ity[Symbol.iterator]=function(){ return { next(x){ fwd=x; return {done:x==="STOP",value:x}; } }; };
function* y2(){ return yield* ity; }
var g0=y2();
g0.next();          // first next() → inner.next(undefined)
g0.next("A");       // resume value "A" → inner.next("A")
if (fwd !== "A") throw "next-not-forwarded:"+fwd;
var last=g0.next("STOP");  // inner returns done with value "STOP" → yield* result
if (last.value !== "STOP" || last.done !== true) throw "next-done:"+JSON.stringify(last);

// throw with no throw method → IteratorClose (return called) + TypeError
mkIter();
var g1=y(); g1.next();
var threw=false; try { g1.throw("foo"); } catch(e){ threw=(e instanceof TypeError); }
if (!threw) throw "throw-no-method-not-TypeError";
if (rc !== 1) throw "close-not-called:"+rc;
if (!g1.next().done) throw "g1-not-closed";

// return calls inner.return; done:true → return its value
rc=0; nc=0; mkIter();
var g2=y(); g2.next();
var v2=g2.return("test");
if (v2.done !== true || v2.value !== "iter.return") throw "ret-done:"+JSON.stringify(v2);
if (rc !== 1) throw "ret-not-called:"+rc;

// return with done:false → keep yielding (does not close the outer gen)
rc=0; nc=0; mkIter({done:false,value:"keep"});
var g3=y(); g3.next();
var v3=g3.return("x");
if (v3.done !== false || v3.value !== "keep") throw "ret-notdone:"+JSON.stringify(v3);
var n3=g3.next();
if (n3.value !== "v" || n3.done !== false) throw "after-ret-yield:"+JSON.stringify(n3);

// return result not an object → TypeError
rc=0; mkIter(42);
var g4=y(); g4.next();
var t4=false; try { g4.return("x"); } catch(e){ t4=(e instanceof TypeError); }
if (!t4) throw "ret-nonobject-not-TypeError";

// inner has a throw method → it is called, return is NOT
rc=0; tc=0;
iterable[Symbol.iterator]=function(){
  return { next(){ return {done:false,value:"v"}; },
           throw(e){ tc++; throw e; },
           return(){ rc++; return {done:true}; } };
};
var g5=y(); g5.next();
var t5=null; try { g5.throw("E"); } catch(e){ t5=e; }
if (t5 !== "E") throw "throw-delegated:"+t5;
if (tc !== 1) throw "throw-method-not-called:"+tc;
if (rc !== 0) throw "return-wrongly-called:"+rc;
print("ok");

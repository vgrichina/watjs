// `return` (and break/throw) through a for-of must close the iterator exactly once;
// continue and normal exhaustion must not call return().
function mk(){ var c=0; var it={next:function(){return {value:1,done:false};},return:function(){c++;return {};}};
  return {it:it, n:function(){return c;}}; }
function iter(m){ var ib={}; ib[Symbol.iterator]=function(){return m.it;}; return ib; }

var m1=mk(); (function(){ for(var x of iter(m1)){ return; } })();
if (m1.n()!==1) throw "return must close: "+m1.n();
var m2=mk(); for(var y of iter(m2)){ break; }
if (m2.n()!==1) throw "break must close: "+m2.n();
var m3=mk(); try{ for(var z of iter(m3)){ throw 1; } }catch(e){}
if (m3.n()!==1) throw "throw must close: "+m3.n();
var m4=mk(); var k=0; for(var w of iter(m4)){ if(++k>=3) break; continue; }
if (m4.n()!==1) throw "continue must not add closes: "+m4.n();
// return value preserved through the close
var r=(function(){ var m=mk(); for(var v of iter(m)){ return [42, m.n]; } })();
if (r[0]!==42) throw "return value lost";
// nested try/finally + iterator close (both run, single close)
var m6=mk(); var ord=[];
(function(){ for(var u of iter(m6)){ try{ return; }finally{ ord.push("fin"); } } })();
if (ord.join(",")!=="fin" || m6.n()!==1) throw "finally+close: "+ord+"/"+m6.n();
// nested for-of: inner return closes both
var ma=mk(), mb=mk();
(function(){ for(var a of iter(ma)){ for(var b of iter(mb)){ return; } } })();
if (ma.n()!==1 || mb.n()!==1) throw "nested close: "+ma.n()+","+mb.n();
// normal array iteration unaffected
var s=0; for(var e of [1,2,3]) s+=e; if (s!==6) throw "normal";
print("ok");

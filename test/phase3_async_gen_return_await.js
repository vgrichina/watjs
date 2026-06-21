var log = [];
var pending = 3;
function fin(){ if(--pending===0){
  if(log.sort().join("|") !== "rejected=err|ret-plain=7,true|ret-promise=X,true") throw "got: "+log.sort().join("|");
  print("ok");
}}
// .return(plainValue) on a suspended async generator
(function(){ var g=async function*(){ yield 1; }; var it=g();
  it.next().then(function(){ it.return(7).then(function(r){ log.push("ret-plain="+r.value+","+r.done); fin(); }); }); })();
// .return(promise) unwraps the value (AsyncGeneratorResolve awaits)
(function(){ var g=async function*(){ yield 1; }; var it=g();
  it.next().then(function(){ it.return(Promise.resolve("X")).then(function(r){ log.push("ret-promise="+r.value+","+r.done); fin(); }); }); })();
// .return(rejectedPromise) rejects the .return() result
(function(){ var g=async function*(){ yield 1; }; var it=g();
  it.next().then(function(){ it.return(Promise.reject("err")).then(function(){ log.push("BAD"); fin(); }, function(e){ log.push("rejected="+e); fin(); }); }); })();

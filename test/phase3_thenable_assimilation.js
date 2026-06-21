var results = {};
var pending = 4;
function done(k,v){ results[k]=v; if(--pending===0){
  if(results.presolve!==9) throw "presolve="+results.presolve;
  if(results.await!==77) throw "await="+results.await;
  if(results.forawait!=="1|2|3") throw "forawait="+results.forawait;
  if(results.reject!=="err") throw "reject="+results.reject;
  print("ok");
}}
Promise.resolve({ then(r){ r(9); } }).then(v => done("presolve",v));
(async function(){ var v = await { then(r){ r(77); } }; done("await",v); })();
(async function(){ var o=[]; for await (var v of [{then(r){r(1)}}, Promise.resolve(2), 3]) o.push(v); done("forawait",o.join("|")); })();
(async function(){ try { await Promise.reject("err"); } catch(e){ done("reject",e); } })();

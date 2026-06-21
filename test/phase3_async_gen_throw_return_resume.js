// async generator .throw() resumes an in-body try/catch; .return() runs try/finally
var log = [];

async function* g1(){
  try { yield 1; log.push("unreached"); }
  catch(e){ log.push("caught:"+e); yield 2; }
  log.push("after");
}
async function* g2(){
  try { yield 1; }
  finally { log.push("fin"); yield 99; log.push("fin2"); }
}

(async function(){
  // .throw() caught by in-body catch → resumes, yields 2
  var a = g1();
  var r = await a.next();        if (r.value !== 1) throw "g1-n1:"+r.value;
  r = await a.throw("E");        if (r.value !== 2 || r.done) throw "g1-throw:"+JSON.stringify(r);
  r = await a.next();            if (!r.done) throw "g1-complete";
  if (log.join(",") !== "caught:E,after") throw "g1-log:"+log.join(",");

  // .return() runs the finally (which yields), then completes with the return value
  log = [];
  var b = g2();
  r = await b.next();            if (r.value !== 1) throw "g2-n1";
  r = await b.return("RV");      if (r.value !== 99 || r.done) throw "g2-finyield:"+JSON.stringify(r);
  r = await b.next();            if (r.value !== "RV" || !r.done) throw "g2-retval:"+JSON.stringify(r);
  r = await b.next();            if (r.value !== undefined || !r.done) throw "g2-closed";
  if (log.join(",") !== "fin,fin2") throw "g2-log:"+log.join(",");

  print("ok");
})();

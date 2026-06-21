var log = [];
async function* g(){ yield 'a'; yield 'b'; yield 'c'; }
var it = g();
var done = 4;
function fin(){ if(--done===0){
  if(log.join(',') !== 'a:false,b:false,c:false,undefined:true') throw 'order: '+log.join(',');
  print('ok');
}}
// 4 synchronous next() calls must queue and resolve in FIFO order
it.next().then(function(r){ log[0]=r.value+':'+r.done; fin(); });
it.next().then(function(r){ log[1]=r.value+':'+r.done; fin(); });
it.next().then(function(r){ log[2]=r.value+':'+r.done; fin(); });
it.next().then(function(r){ log[3]=r.value+':'+r.done; fin(); });

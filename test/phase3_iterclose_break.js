function p(n,v){print(n+"="+v);}
function mk(){ var c=false; return { [Symbol.iterator](){ var i=0; return { next(){ return i<3?{value:i++,done:false}:{value:undefined,done:true}; }, return(){ c=true; return {done:true}; } }; }, closed(){ return c; } }; }
var a=mk(); for(var x of a){ if(x===1) break; } p("break-closes", a.closed());
var b=mk(); for(var y of b){} p("normal-no-close", b.closed());
var s=""; for(var z of [1,2,3,4]){ if(z===3) break; s+=z; } p("array-break", s);
var s2=""; for(var w of [1,2,3]){ s2+=w; } p("array-full", s2);
var s3=""; for(var v of [1,2,3,4]){ if(v%2===0) continue; s3+=v; } p("continue", s3);

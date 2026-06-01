function p(n,v){print(n+"="+v);}
function mk(){ var c=false; return { [Symbol.iterator](){ var i=0; return { next(){ return i<3?{value:i++,done:false}:{value:undefined,done:true}; }, return(){ c=true; return {done:true}; } }; }, closed(){ return c; } }; }
var a=mk(); for(var x of a){ if(x===1) break; } p("break-closes", a.closed());
var b=mk(); for(var y of b){} p("normal-no-close", b.closed());
var s=""; for(var z of [1,2,3,4]){ if(z===3) break; s+=z; } p("array-break", s);
var s2=""; for(var w of [1,2,3]){ s2+=w; } p("array-full", s2);
var s3=""; for(var v of [1,2,3,4]){ if(v%2===0) continue; s3+=v; } p("continue", s3);
var t1=mk(); try{ for(var p1 of t1){ if(p1===1) throw new Error("b"); } }catch(e){} p("throw-closes", t1.closed());
var t2=mk(); var msg=""; try{ for(var p2 of t2){ throw new Error("Z"); } }catch(e){ msg=e.message; } p("throw-prop", msg);
function* g(){ yield 1; yield 2; } var gs=""; for(var gg of g()){ gs+=gg; } p("gen", gs);

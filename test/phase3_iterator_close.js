// IteratorClose: helpers call source.return() on early termination
function mk(log){ var i=0; return { next:function(){ return {value:i++,done:false}; }, return:function(){ log.push("R"); return {done:true}; } }; }
var a=[]; print(Iterator.from(mk(a)).take(2).toArray().join(",")); print(a.join(""));   // 0,1  R
var b=[]; Iterator.from(mk(b)).some(function(v){ return v===1; }); print(b.join(""));   // R
var c=[]; Iterator.from(mk(c)).every(function(v){ return v<0; }); print(c.join(""));    // R (first is falsy)
var d=[]; Iterator.from(mk(d)).find(function(v){ return v===0; }); print(d.join(""));   // R
var e=[]; var h=Iterator.from(mk(e)).map(function(x){return x;}); h.next(); print(h.return().done); print(e.join("")); // true R
var f=[]; print(Iterator.from(mk(f)).drop(2).take(1).toArray().join(",")); print(f.join("")); // 2  R

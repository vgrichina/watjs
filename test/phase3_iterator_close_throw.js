// IteratorClose on a throwing callback: source.return() runs, original error propagates
function mk(log){ var i=0; return { next:function(){ return {value:i++,done:false}; }, return:function(){ log.push("R"); return {done:true}; } }; }
var a=[]; try { Iterator.from(mk(a)).map(function(){ throw new RangeError("x"); }).next(); } catch(e){ a.push(e instanceof RangeError ? "RE":"?"); }
print(a.join(","));
var b=[]; try { Iterator.from(mk(b)).forEach(function(){ throw new TypeError("y"); }); } catch(e){ b.push(e instanceof TypeError?"TE":"?"); }
print(b.join(","));
var c=[]; try { Iterator.from(mk(c)).filter(function(){ throw new Error("z"); }).next(); } catch(e){ c.push("E"); }
print(c.join(","));
var d=[]; try { Iterator.from(mk(d)).reduce(function(){ throw new TypeError("r"); }, 0); } catch(e){ d.push(e instanceof TypeError?"TE":"?"); }
print(d.join(","));

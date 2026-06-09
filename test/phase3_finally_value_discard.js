// A finally block that completes normally discards its own completion value;
// the try/catch completion value wins (spec: "If result.[[Type]] is normal, set result to C").
function eq(a,b,l){ if(a!==b) throw l+": "+a+" != "+b; }
eq(eval('1; try { 2; } finally { 3; }'), 2, "finally-discards");
eq(eval('1; try {} finally { 3; }'), undefined, "empty-try");
eq(eval('1; try { 2; } finally {}'), 2, "empty-finally");
eq(eval('1; try { throw 0; } catch(e){ 5; } finally { 9; }'), 5, "catch-finally");
eq(eval('1; try { throw 0; } catch(e){} finally { 9; }'), undefined, "empty-catch-finally");
// the finally STILL runs (only its value is discarded)
var ran = false; eval('try { 1; } finally { ran = true; }');
if (!ran) throw "finally must run";
// abrupt completions: return value unaffected, finally runs
var order = [];
var r = (function(){ try { order.push('t'); return 7; } finally { order.push('f'); } })();
eq(r, 7, "return-value");
eq(order.join(','), "t,f", "finally-runs-on-return");
print("ok");

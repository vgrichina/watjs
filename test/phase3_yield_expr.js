function* g() { var x = yield 1; var y = yield x * 2; return x + y; }
var it = g();
print("r1=" + JSON.stringify(it.next()));     // {value:1}
print("r2=" + JSON.stringify(it.next(10)));    // x=10 → {value:20}
print("r3=" + JSON.stringify(it.next(5)));     // y=5 → {value:15,done:true}
// yield with no operand
function* h() { var a = yield; print("a=" + a); }
var ih = h(); ih.next(); ih.next(7);

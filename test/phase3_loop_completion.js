// A loop's completion value starts undefined (spec: ForBodyEvaluation "Let V be undefined");
// a value-less / never-run body must NOT inherit the prior statement's value.
function eq(a,b){ if (a!==b) throw "got "+a+" want "+b; }
eq(eval('1; while(false){}'), undefined);
eq(eval('2; while(false){3;}'), undefined);
eq(eval('1; for(;false;){}'), undefined);
eq(eval('1; for(var a of [0]){}'), undefined);
eq(eval('2; for(var b of [0]){3;}'), 3);
eq(eval('1; for(var k in {x:1}){}'), undefined);
eq(eval('2; do {} while(false)'), undefined);
eq(eval('2; do {5;} while(false)'), 5);
// a body that yields a value still reports it
eq(eval('0; for(var i=0;i<3;i++){ i; }'), 2);
eq(eval('9; while(false){}'), undefined);
print("ok");

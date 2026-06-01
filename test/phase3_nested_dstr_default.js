function p(n,v){print(n+"="+v);}
function f1([[x, y, z] = [4, 5, 6]]){ return x+","+y+","+z; } p("arr-nested-def", f1([]));
function f2({a: [x] = [9]}){ return x; } p("obj-arr-def", f2({}));
function f3({a: {b} = {b:7}}){ return b; } p("obj-obj-def", f3({}));
function f4([[x]=[9]]){ return x; } p("present", f4([[42]]));
function f5([[[z]=[5]]=[[6]]]){ return z; } p("deep", f5([]));
function f6([a, [b]=[a*10]]){ return a+","+b; } p("refprev", f6([3]));
var C = class { m([[x,y]=[1,2]]){ return x+","+y; } }; p("class-meth", new C().m([]));
var o = { m([{q}={q:8}]){ return q; } }; p("obj-meth", o.m([]));
var arrow = ([[k]=[7]]) => k; p("arrow", arrow([]));

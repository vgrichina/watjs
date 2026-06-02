function p(n,v){print(n+"="+v);}
// tail-call to a closure must see the enclosing local (not reuse caller scope)
function outer(){ var x=42; function inner(){return x;} return inner(); }
p("tail-closure", outer());
// deep self-recursion still O(1) (scope reuse preserved)
function loop(n,acc){ if(n===0) return acc; return loop(n-1,acc+1); }
p("deep-self", loop(100000,0));
// arrow has no own `arguments` — resolves lexically
function h(){ var a=()=>arguments[0]; return a(); }
p("arrow-args-lexical", h(7,8));
// arrow with rest still works (rest built from call args)
var r = (...xs) => xs.length;
p("arrow-rest", r(1,2,3,4));
// normal function still has its own arguments
function f(){ return arguments.length; }
p("fn-args", f(1,2,3));
// nested closure tail-call chain
function a1(){ var v=5; function b1(){ function c1(){return v;} return c1(); } return b1(); }
p("nested-chain", a1());

var v1=1;
var t={ set foo(val){ v1=val; }, get bar(){ return 7; } };
Object.freeze(t);
t.foo=2; print("plainset="+v1);
Object.assign(t, {foo:5}); print("assign="+v1);
print("getter="+t.bar);
function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print(tc(function(){"use strict"; Object.freeze({a:1}).a=9; }));

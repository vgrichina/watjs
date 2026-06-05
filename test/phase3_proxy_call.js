// Function proxies: apply / construct traps, typeof, handler as `this`
var log=[];
function f(a,b){ return a+b; }
var p = new Proxy(f, {
  apply(t,thisArg,args){ log.push("apply:"+(this.tag||"H")); return t.apply(thisArg, args)*10; }
});
p.handler = p;  // (no-op)
print(typeof p);            // function
print(p(2,3));              // 50
print(Reflect.apply(p, null, [4,5]));  // 90
print(Function.prototype.apply.call(p, null, [1,1]));  // 20
function F(a){ this.a = a; }
var pc = new Proxy(F, { construct(t, args, nt){ var o = new t(...args); o.viaProxy = true; return o; } });
var inst = new pc(7);
print(inst.a);             // 7
print(inst.viaProxy);      // true
print(inst instanceof F);  // true
print(Reflect.construct(pc, [9]).a);  // 9
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ new (new Proxy(F, { construct(){ return 5; } }))(); }));  // non-object → TypeError
// no traps → forward
print(new Proxy(f, {})(7,8));   // 15
print(new (new Proxy(F, {}))(3).a); // 3

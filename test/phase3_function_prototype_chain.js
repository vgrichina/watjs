function p(n,v){print(n+"="+v);}
p("getproto-userfn", Object.getPrototypeOf(function(){}) === Function.prototype);
p("getproto-arrow", Object.getPrototypeOf(()=>{}) === Function.prototype);
p("getproto-Number", Object.getPrototypeOf(Number) === Function.prototype);
p("getproto-Array", Object.getPrototypeOf(Array) === Function.prototype);
p("getproto-FnProto", Object.getPrototypeOf(Function.prototype) === Object.prototype);
p("isproto-fnproto-Number", Function.prototype.isPrototypeOf(Number));
p("isproto-fnproto-userfn", Function.prototype.isPrototypeOf(function(){}));
p("isproto-objproto-fn", Object.prototype.isPrototypeOf(function(){}));
p("isproto-neg", Function.prototype.isPrototypeOf({}));
p("reflect-getproto", Reflect.getPrototypeOf(Number) === Function.prototype);

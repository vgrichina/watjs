function t(f){try{f();return "no-throw";}catch(e){return e.constructor.name;}}
print("obj-Object=" + ({} instanceof Object));
print("arr-Object=" + ([] instanceof Object) + " arr-Array=" + ([] instanceof Array));
print("strw-Object=" + (new String("x") instanceof Object));
print("getproto-obj=" + (Object.getPrototypeOf({}) === Object.prototype));
print("getproto-arr=" + (Object.getPrototypeOf([]) === Array.prototype));
print("inherit-toString=" + (typeof ({}).toString) + "," + (typeof [].hasOwnProperty));
print("setproto=" + (function(){var a={},b={k:1}; Object.setPrototypeOf(a,b); return a.k;})());
print("cycle=" + t(function(){ var o={}; Object.setPrototypeOf(o,o); }));
function C2(){} var c2=new C2();
print("isProto-ctor=" + C2.prototype.isPrototypeOf(c2));
print("isProto-objroot=" + Object.prototype.isPrototypeOf(c2));
print("isProto-arr=" + Array.prototype.isPrototypeOf([]));
print("isProto-prim=" + Object.prototype.isPrototypeOf(5));

function p(n,v){print(n+"="+v);}
var o = {};
p("get", o.__proto__ === Object.prototype);
var base = {greet:"hi"};
o.__proto__ = base;
p("set-links", o.greet);                 // hi (inherited)
p("get-after", o.__proto__ === base);
p("fn", (function(){}).__proto__ === Function.prototype);
p("arr", [].__proto__ === Array.prototype);
p("create-null", Object.create(null).__proto__);  // undefined
p("set-null", (function(){ var a={}; a.__proto__=null; return Object.getPrototypeOf(a); })()); // null
p("set-prim-noop", (function(){ var a={}; a.__proto__=42; return a.__proto__===Object.prototype; })()); // true
p("cycle", (function(){ var a={}, b={}; b.__proto__=a; try { a.__proto__=b; return "no-throw"; } catch(e){ return e.constructor.name; } })()); // TypeError

// Object.assign copies own enumerable props from string/array/object/symbol sources
print(JSON.stringify(Object.assign({}, "hi")));
print(JSON.stringify(Object.assign({}, [10,20])));
var sym = Symbol("s"); var src = {a:1}; src[sym] = 9;
var t = Object.assign({}, src);
print(t.a + "," + t[sym]);
print(JSON.stringify(Object.assign({}, null, undefined, {x:1})));
// inherited props NOT copied
var base = {inh:7}; var o = Object.create(base); o.own = 1;
print(JSON.stringify(Object.assign({}, o)));
// getter on source invoked once
var log = []; var g = {}; Object.defineProperty(g,"v",{get:function(){log.push(1);return 5;},enumerable:true});
print(Object.assign({}, g).v + ":" + log.length);
// target returned
var tgt = {}; print(Object.assign(tgt, {z:3}) === tgt);

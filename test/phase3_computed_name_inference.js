function p(n,v){print(n+"='"+v+"'");}
var k = "foo";
var o = { [k](){}, ["bar"]: function(){}, [k+"2"]: ()=>{}, get [k+"G"](){return 1;}, set [k+"S"](v){} };
p("method", o.foo.name);          // foo
p("data-fn", o.bar.name);          // bar
p("arrow", o.foo2.name);           // foo2
p("getter", Object.getOwnPropertyDescriptor(o,"fooG").get.name); // get fooG
p("setter", Object.getOwnPropertyDescriptor(o,"fooS").set.name); // set fooS
// symbol-keyed
var s = Symbol("desc");
var sa = Symbol();
var o2 = { [s]: ()=>{}, [sa]: ()=>{} };
p("sym-desc", o2[s].name);         // [desc]
p("sym-nodesc", o2[sa].name);      // (empty)
// named fn value is not overridden
p("named-keeps", ({ [k]: function named(){} }).foo.name); // named

// SHOULD be named:
var a = function(){};            if (a.name !== "a") throw new Error("var-fn: "+a.name);
var b = () => {};                if (b.name !== "b") throw new Error("arrow: "+b.name);
var c = class {};                if (c.name !== "c") throw new Error("class: "+c.name);
var d = (function(){});          if (d.name !== "d") throw new Error("paren-fn: "+d.name);
var e = ((() => {}));            if (e.name !== "e") throw new Error("paren-arrow: "+e.name);
let f; f = function(){};         if (f.name !== "f") throw new Error("assign-fn: "+f.name);
var o = { m: function(){} };     if (o.m.name !== "m") throw new Error("obj-key: "+o.m.name);
var [g = function(){}] = [];     if (g.name !== "g") throw new Error("arr-default: "+g.name);
var {h = () => {}} = {};         if (h.name !== "h") throw new Error("obj-default: "+h.name);
// SHOULD NOT be named (cover grammar — sequence/logical):
var x = (0, function(){});       if (x.name === "x") throw new Error("seq wrongly named: "+x.name);
var y = (1, () => {});           if (y.name === "y") throw new Error("seq-arrow wrongly named");
var z = false || function(){};   if (z.name === "z") throw new Error("logical wrongly named");
// named literals must NOT be renamed; member/call results must NOT be named
var p = function named(){};       if (p.name !== "named") throw new Error("named-fn renamed");
var q = class Named {};           if (q.name !== "Named") throw new Error("named-class renamed");
var r = function(){}.bind(null);  if (r.name === "r") throw new Error("bind result named");

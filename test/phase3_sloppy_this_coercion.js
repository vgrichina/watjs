// OrdinaryCallBindThis: a sloppy function coerces `this` — null/undefined → global
// object, a primitive → its wrapper; a strict function leaves `this` unchanged.
function sloppy(){ return this; }
if (typeof sloppy.call(undefined) !== "object") throw "sloppy undefined → global";
if (typeof sloppy.call(null) !== "object") throw "sloppy null → global";
if (typeof sloppy.call(5) !== "object" || sloppy.call(5).valueOf() !== 5) throw "sloppy number → wrapper";
if (typeof sloppy.call("s") !== "object" || sloppy.call("s").valueOf() !== "s") throw "sloppy string → wrapper";
function setsFeat(){ this.feat = "x"; return this.feat; }
if (setsFeat.apply(5) !== "x") throw "set on boxed primitive this";
if (setsFeat.apply(null) !== "x") throw "set on global this";
function strict(){ "use strict"; return this; }
if (strict.call(undefined) !== undefined) throw "strict undefined unchanged";
if (strict.call(5) !== 5) throw "strict primitive unchanged";
// legacy accessors are strict built-ins: called on null/undefined → TypeError
var t=false; try { Object.prototype.__defineGetter__.call(null, "x", function(){}); } catch(e){ t = e instanceof TypeError; }
if (!t) throw "__defineGetter__ on null must throw";
print("ok");

// RegExp.prototype[@@match] follows the spec: non-global returns RegExpExec(rx,S);
// global loops RegExpExec accumulating Get(result,"0"), resetting lastIndex; and it
// invokes the rx's (overridable) exec method.
if (JSON.stringify("aXbXc".match(/X/g)) !== '["X","X"]') throw new Error("global");
if ("abc".match(/z/) !== null) throw new Error("no match null");
if (JSON.stringify("a1b2".match(/\d/g)) !== '["1","2"]') throw new Error("digits");
// non-global returns the full exec array
var m = "abc".match(/(b)/);
if (m[0] !== "b" || m[1] !== "b" || m.index !== 1) throw new Error("non-global exec result");
// custom exec is called
var r = /./; var calls = 0; r.exec = function () { calls++; return null; };
if ("xyz".match(r) !== null || calls !== 1) throw new Error("custom exec non-global");
var r2 = /x/g; var seq = [{ 0: "x", index: 0 }, { 0: "x", index: 2 }, null]; var i = 0;
r2.exec = function () { return seq[i++]; };
if (JSON.stringify("xyx".match(r2)) !== '["x","x"]') throw new Error("custom exec global loop");
// exec returning a non-object/non-null throws
var r3 = /./; r3.exec = function () { return 42; };
var threw = false; try { "a".match(r3); } catch (e) { threw = e instanceof TypeError; }
if (!threw) throw new Error("exec bad return type");
print("ok");

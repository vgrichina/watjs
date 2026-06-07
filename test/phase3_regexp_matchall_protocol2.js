// RegExp.prototype[@@matchAll]: SpeciesConstructor matcher + per-next RegExpExec iterator.
var out = [...("a1b2c3".matchAll(/(\d)/g))].map(function (m) { return m[0] + ":" + m[1]; });
if (JSON.stringify(out) !== '["1:1","2:2","3:3"]') throw new Error("global matchAll");
if ([...("abc".matchAll(/x/g))].length !== 0) throw new Error("no match");
// manual iteration
var it = "hello".matchAll(/l/g);
var a = it.next(), b = it.next(), c = it.next();
if (a.done || a.value[0] !== "l") throw new Error("step1");
if (b.done || b.value[0] !== "l") throw new Error("step2");
if (!c.done) throw new Error("step3 done");
// named groups via the result object
if ([...("a5".matchAll(/(?<y>\d)/g))][0].groups.y !== "5") throw new Error("named");
// String.prototype.matchAll with a string arg builds a global regex
if (JSON.stringify([...("abc".matchAll("b"))][0]) !== '["b"]') throw new Error("string arg");
print("ok");

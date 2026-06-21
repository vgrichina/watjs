var GF = Object.getPrototypeOf(function*(){}).constructor;
var AGF = Object.getPrototypeOf(async function*(){}).constructor;
if (GF.name !== "GeneratorFunction") throw "GF.name="+GF.name;
if (GF.length !== 1) throw "GF.length";
if (AGF.name !== "AsyncGeneratorFunction") throw "AGF.name";
// %Generator% (GF.prototype) tags
if (GF.prototype[Symbol.toStringTag] !== "GeneratorFunction") throw "Gen tag";
if (GF.prototype.prototype[Symbol.toStringTag] !== "Generator") throw "GenProto tag";
// instances
function* g(){ yield 1; }
if (!(g instanceof GF)) throw "g instanceof GF";
if (Object.getPrototypeOf(g) !== GF.prototype) throw "proto identity";
if (Object.prototype.toString.call(g()) !== "[object Generator]") throw "gen toString";
if (Object.prototype.toString.call((async function*(){})()) !== "[object AsyncGenerator]") throw "agen toString";
// still iterable + callable
if ([...g()].join() !== "1") throw "iterate";
if (typeof g.call !== "function") throw "g.call";
// dynamic construction
var made = new GF("a","yield a");
if (!(made instanceof GF)) throw "made instanceof";
if ([...made(5)].join() !== "5") throw "made yields";
// gen function still has its own length/name
if (g.name !== "g") throw "g.name";
// next/return/throw live on %GeneratorPrototype% (inherited), not own to the instance
var GenProto = GF.prototype.prototype;
if (!GenProto.hasOwnProperty("next")) throw "next not own on GeneratorPrototype";
if (!GenProto.hasOwnProperty("return")) throw "return not own";
if (!GenProto.hasOwnProperty("throw")) throw "throw not own";
if (g().hasOwnProperty("next")) throw "next should not be own on instance";
var nd = Object.getOwnPropertyDescriptor(GenProto, "next");
if (nd.writable !== true || nd.enumerable !== false || nd.configurable !== true) throw "next desc";
print("ok");

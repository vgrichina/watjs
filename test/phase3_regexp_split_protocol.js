// RegExp.prototype[@@split]: SpeciesConstructor + sticky splitter + RegExpExec; captures
// from the result object; limit honored.
if (JSON.stringify("a,b,c".split(/,/)) !== '["a","b","c"]') throw new Error("basic");
if (JSON.stringify("a1b2c".split(/(\d)/)) !== '["a","1","b","2","c"]') throw new Error("captures");
if (JSON.stringify("abc".split(/x/)) !== '["abc"]') throw new Error("no match");
if (JSON.stringify("".split(/x/)) !== '[""]') throw new Error("empty no match");
if (JSON.stringify("a,b,c,d".split(/,/, 2)) !== '["a","b"]') throw new Error("limit");
if (JSON.stringify("test".split(/(?<x>e)/)) !== '["t","e","st"]') throw new Error("named capture");
// the splitter is constructed sticky regardless of the receiver's flags
if (JSON.stringify("aXbXc".split(/X/g)) !== '["a","b","c"]') throw new Error("global receiver");
print("ok");

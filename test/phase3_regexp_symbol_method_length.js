// RegExp.prototype Symbol-method lengths: match/search/matchAll = 1, replace/split = 2.
var P = RegExp.prototype;
if (P[Symbol.match].length !== 1) throw new Error("@@match length");
if (P[Symbol.search].length !== 1) throw new Error("@@search length");
if (P[Symbol.matchAll].length !== 1) throw new Error("@@matchAll length");
if (P[Symbol.replace].length !== 2) throw new Error("@@replace length");
if (P[Symbol.split].length !== 2) throw new Error("@@split length");
print("ok");

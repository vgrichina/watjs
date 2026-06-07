// An empty / empty-matching group satisfies a min>=1 quantifier (matches zero-width once).
if (JSON.stringify(/(?:)/.exec("abc")) !== '[""]') throw new Error("(?:) matches empty");
if (JSON.stringify("abc".split(/(?:)/)) !== '["a","b","c"]') throw new Error("split empty regex");
if (JSON.stringify("".split(/(?:)/)) !== "[]") throw new Error("empty string split empty regex");
if (JSON.stringify(/(x?)/.exec("abc")) !== '["",""]') throw new Error("optional empty capture");
// non-empty quantifiers still work
if (/a+/.exec("aaa")[0] !== "aaa") throw new Error("a+");
if (/(ab)+/.exec("ababab")[0] !== "ababab") throw new Error("(ab)+");
if (JSON.stringify(/(a)(b)/.exec("ab")) !== '["ab","a","b"]') throw new Error("captures");
print("ok");

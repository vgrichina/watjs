// includes/startsWith/endsWith reject a RegExp arg via spec IsRegExp (reads @@match;
// a throwing getter propagates; a truthy @@match makes any object "regexp").
["includes", "startsWith", "endsWith"].forEach(function (m) {
  var t = false; try { "abc"[m](/b/); } catch (e) { t = e instanceof TypeError; }
  if (!t) throw new Error(m + " reject /re/");
  var o = {}; Object.defineProperty(o, Symbol.match, { get: function () { throw new TypeError("x"); } });
  var t2 = false; try { "abc"[m](o); } catch (e) { t2 = e instanceof TypeError; }
  if (!t2) throw new Error(m + " propagate throwing @@match");
  var o2 = {}; o2[Symbol.match] = true;
  var t3 = false; try { "abc"[m](o2); } catch (e) { t3 = e instanceof TypeError; }
  if (!t3) throw new Error(m + " truthy @@match → regexp");
});
// normal string args still work
if (!"abc".includes("b") || !"abc".startsWith("ab") || !"abc".endsWith("bc")) throw new Error("normal");
print("ok");

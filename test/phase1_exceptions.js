try {
  throw "boom";
} catch (e) {
  print("caught: " + e);
}
function risky(n) {
  if (n < 0) throw "negative";
  return n * 2;
}
print(risky(5));
try {
  print(risky(-1));
} catch (err) {
  print("error: " + err);
}
var result;
try {
  result = "ok";
  throw "skip";
  result = "unreachable";
} catch (e) {
  result = result + "/" + e;
}
print(result);
assert(1 + 1 === 2);
assert("a" + "b" === "ab", "concat works");
print("asserts passed");

// `return` out of a try-block must pop its handler. Otherwise the lingering
// handler wrongly catches a throw raised later in the caller.
function earlyReturn() {
  try { return "early"; } catch (e) { return "WRONG:" + e; }
}
function caller() {
  earlyReturn();      // exits its try via return — handler must not linger
  throw "real";       // must propagate to the outer catch, unwrapped
}
try { caller(); } catch (e) { print("leak-check: " + e); }

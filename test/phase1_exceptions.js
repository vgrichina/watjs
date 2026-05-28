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

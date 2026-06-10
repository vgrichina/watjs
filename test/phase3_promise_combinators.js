// Promise.all/race/any/allSettled basics + non-constructor receiver throws.
function check(c, m) { if (!c) throw new Error(m); }
(async function () {
  check((await Promise.all([1, 2, 3])).join() === "1,2,3", "all");
  var a2 = await Promise.all([Promise.resolve(5), 6]);
  check(a2[0] === 5 && a2[1] === 6, "all2");
  check((await Promise.race([Promise.resolve("first"), Promise.resolve("second")])) === "first", "race");
  check((await Promise.any([Promise.reject(1), Promise.resolve("won")])) === "won", "any");
  var s = await Promise.allSettled([Promise.resolve(1), Promise.reject(2)]);
  check(s[0].status === "fulfilled" && s[0].value === 1 && s[1].status === "rejected" && s[1].reason === 2, "allSettled");
  var rej; try { await Promise.all([Promise.reject("nope")]); } catch (e) { rej = e; }
  check(rej === "nope", "all-reject");
  var threw = false;
  try { Promise.all.call(eval, []); } catch (e) { threw = e instanceof TypeError; }
  check(threw, "non-constructor receiver throws");
  print("PASS");
})().then(undefined, function (e) { print("FAIL: " + e.message); });

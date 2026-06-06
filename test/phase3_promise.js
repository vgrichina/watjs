// Synchronous Promise model: then/catch/finally + statics + rejection + async.
function p(n, v) { print(n + "=" + v); }
p("proto-then", typeof Promise.prototype.then);  // function
p("all-fn", typeof Promise.all);                 // function

var log = [];
Promise.resolve(5).then(function (v) { log.push("a" + v); });
new Promise(function (res) { res(9); }).then(function (v) { log.push("b" + v); });
new Promise(function (res, rej) { rej("E"); }).catch(function (e) { log.push("c" + e); });
Promise.reject("R").catch(function (e) { log.push("d" + e); });
Promise.resolve(1).then(function () { throw "boom"; }).catch(function (e) { log.push("e" + e); });
p("chain", log.join(","));   // a5,b9,cE,dR,eboom

Promise.all([Promise.resolve(1), 2, Promise.resolve(3)]).then(function (a) { p("all", a.join(",")); }); // 1,2,3
Promise.all([1, Promise.reject("bad")]).catch(function (e) { p("all-rej", e); }); // bad
Promise.race([Promise.resolve("first"), Promise.resolve("second")]).then(function (v) { p("race", v); }); // first
Promise.allSettled([Promise.resolve(1), Promise.reject(2)]).then(function (a) { p("settled", JSON.stringify(a)); });
Promise.any([Promise.reject(1), Promise.resolve(7)]).then(function (v) { p("any", v); }); // 7

async function f() { return 5; } f().then(function (v) { p("async", v); }); // 5
async function g() { var x = await Promise.resolve(10); return x + 1; } g().then(function (v) { p("await", v); }); // 11
async function h() { try { await Promise.reject("err"); } catch (e) { return "caught:" + e; } } h().then(function (v) { p("await-reject", v); }); // caught:err

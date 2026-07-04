// JSON.stringify's replacer: IsArray sees through a Proxy (spec IsArray recurses to [[ProxyTarget]]),
// so a Proxy wrapping an array is an array replacer (a key filter).
if (JSON.stringify({ a: 1, b: 2 }, new Proxy(["b"], {})) !== '{"b":2}') throw new Error("proxy array replacer");
if (JSON.stringify({ b: { a: 3, b: 4 } }, new Proxy(["b"], {})) !== '{"b":{"b":4}}') throw new Error("nested");
// nested proxy-of-proxy-of-array
if (JSON.stringify({ a: 1, b: 2 }, new Proxy(new Proxy(["a"], {}), {})) !== '{"a":1}') throw new Error("nested proxy");
// plain array and function replacers still work
if (JSON.stringify({ a: 1, b: 2 }, ["b"]) !== '{"b":2}') throw new Error("plain array");
if (JSON.stringify({ a: 1, b: 2 }, function (k, v) { return k === "a" ? undefined : v; }) !== '{"b":2}') throw new Error("fn replacer");
if (JSON.stringify({ a: 1, b: 2 }) !== '{"a":1,"b":2}') throw new Error("no replacer");
// a revoked proxy replacer throws TypeError
var r = Proxy.revocable(["b"], {}); r.revoke();
var threw = false;
try { JSON.stringify({ a: 1 }, r.proxy); } catch (e) { threw = e instanceof TypeError; }
if (!threw) throw new Error("revoked proxy must throw TypeError");
print("ok");

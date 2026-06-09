// typeof a proxy reflects its target's callability, fixed at creation (survives revoke).
assert(typeof new Proxy({}, {}) === "object", "proxy of object");
assert(typeof new Proxy(function () {}, {}) === "function", "proxy of function");
var r1 = Proxy.revocable({}, {}); r1.revoke();
assert(typeof r1.proxy === "object", "revoked proxy of object");
var r2 = Proxy.revocable(function () {}, {}); r2.revoke();
assert(typeof r2.proxy === "function", "revoked proxy of function");
assert(typeof new Proxy(new Proxy(function () {}, {}), {}) === "function", "nested proxy of function");
assert(typeof new Proxy(new Proxy({}, {}), {}) === "object", "nested proxy of object");

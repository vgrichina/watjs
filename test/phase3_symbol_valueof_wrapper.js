// Symbol.prototype.valueOf unboxes a Symbol wrapper object and brand-checks.
var s = Symbol("x");
if (s.valueOf() !== s) throw new Error("primitive valueOf");
if (typeof Object(s).valueOf() !== "symbol") throw new Error("wrapper typeof");
if (Object(s).valueOf() !== s) throw new Error("wrapper identity");
var threw = false;
try { Symbol.prototype.valueOf.call({}); } catch (e) { threw = e instanceof TypeError; }
if (!threw) throw new Error("brand check");
print("ok");

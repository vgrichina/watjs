// Proxy.revocable(target, handler) → { proxy, revoke }; after revoke(), every
// operation on the proxy throws a TypeError. Both target and handler must be objects.
if (typeof Proxy.revocable !== "function") throw "exists";
if (Proxy.revocable.length !== 2) throw "length";
var r = Proxy.revocable({ x: 1 }, {});
if (typeof r.proxy !== "object" || typeof r.revoke !== "function") throw "shape";
if (r.proxy.x !== 1) throw "proxy works before revoke";
r.revoke();
var g=false; try { r.proxy.x; } catch(e){ g = e instanceof TypeError; } if (!g) throw "get after revoke";
var s=false; try { r.proxy.y = 2; } catch(e){ s = e instanceof TypeError; } if (!s) throw "set after revoke";
var h=false; try { ("z" in r.proxy); } catch(e){ h = e instanceof TypeError; } if (!h) throw "has after revoke";
r.revoke(); // idempotent, no throw
[5, "s", null, undefined].forEach(function(bad){
  var t1=false; try { Proxy.revocable(bad, {}); } catch(e){ t1 = e instanceof TypeError; } if (!t1) throw "non-object target "+String(bad);
  var t2=false; try { Proxy.revocable({}, bad); } catch(e){ t2 = e instanceof TypeError; } if (!t2) throw "non-object handler "+String(bad);
});
print("ok");

// JSON.stringify uses IsArray (sees through Proxies) and reads array length via Get.
if (JSON.stringify(new Proxy([0,1], {})) !== "[0,1]") throw "proxy array";
if (JSON.stringify(new Proxy({a:1}, {})) !== '{"a":1}') throw "proxy object";
if (JSON.stringify(new Proxy(new Proxy([5,6], {}), {})) !== "[5,6]") throw "nested proxy";
// plain arrays unaffected
if (JSON.stringify([1,2,3]) !== "[1,2,3]") throw "plain";
if (JSON.stringify([1,,3]) !== "[1,null,3]") throw "holes";
if (JSON.stringify({a:[1,2],b:{c:3}}) !== '{"a":[1,2],"b":{"c":3}}') throw "nested";
if (JSON.stringify([]) !== "[]") throw "empty";
// circular still detected
var c = []; c.push(c);
var threw = false; try { JSON.stringify(c); } catch(e){ threw = e instanceof TypeError; }
if (!threw) throw "circular must throw";
print("ok");

// AggregateError + Array.isArray through Proxy.
function p(n, v) { print(n + "=" + v); }
p("type", typeof AggregateError);                 // function
var ae = new AggregateError([1, 2, 3], "msg");
p("errors", ae.errors.join(","));                 // 1,2,3
p("name", ae.name);                               // AggregateError
p("instanceof", ae instanceof Error);             // true
p("toString", ae.toString());                     // AggregateError: msg
p("no-msg", new AggregateError([]).message);      // (empty)
p("isarray-arr-proxy", Array.isArray(new Proxy([], {}))); // true
p("isarray-obj-proxy", Array.isArray(new Proxy({}, {}))); // false
p("any", (function () { var r; Promise.any([Promise.reject(1), Promise.reject(2)]).catch(function (e) { r = (e instanceof AggregateError) + "," + e.errors.join(","); }); return r; })()); // true,1,2

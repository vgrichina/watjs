// JSON.parse(text, reviver) walks the result bottom-up.
function p(n, v) { print(n + "=" + v); }
p("transform", JSON.parse('{"a":1}', function (k, v) { return typeof v === "number" ? v * 10 : v; }).a); // 10
p("delete", JSON.stringify(JSON.parse('{"a":1,"b":2}', function (k, v) { return k === "b" ? undefined : v; }))); // {"a":1}
p("array", JSON.parse('[1,2,3]', function (k, v) { return typeof v === "number" ? v + 1 : v; }).join(",")); // 2,3,4
p("nested", JSON.parse('{"a":{"b":1}}', function (k, v) { return typeof v === "number" ? v * 2 : v; }).a.b); // 2
p("root-key", (function () { var last; JSON.parse('{"x":1}', function (k, v) { last = k; return v; }); return last; })()); // (empty root key last)
p("no-reviver", JSON.parse('{"a":5}').a); // 5
p("this-holder", (function () { var ok; JSON.parse('{"a":1}', function (k, v) { if (k === "a") ok = (this.a === 1); return v; }); return ok; })()); // true

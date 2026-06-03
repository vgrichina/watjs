function p(n,v){print(n+"="+v);}
var e = new Error("msg");
p("message", e.message);
p("message-enum", Object.getOwnPropertyDescriptor(e,"message").enumerable);  // false
p("message-writable", Object.getOwnPropertyDescriptor(e,"message").writable); // true
p("message-config", Object.getOwnPropertyDescriptor(e,"message").configurable); // true
p("not-in-keys", Object.keys(e).indexOf("message") < 0); // true
p("cause", new Error("m",{cause:42}).cause);  // 42
p("no-cause-prop", "cause" in new Error("m")); // false
p("type-cause", new TypeError("t",{cause:"c"}).cause); // c
p("noarg-message", "message" in new Error()); // false (no own; inherits "")
p("toString", new RangeError("r").toString()); // RangeError: r
p("null-opt", "cause" in new Error("m", null)); // false

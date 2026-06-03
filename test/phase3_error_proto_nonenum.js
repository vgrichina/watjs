function p(n,v){print(n+"="+v);}
function ck(E){ var d=Object.getOwnPropertyDescriptor(E.prototype,"name"); return d.enumerable; }
p("Error-name-enum", ck(Error));            // false
p("TypeError-name-enum", ck(TypeError));    // false
p("RangeError-name-enum", ck(RangeError));  // false
p("msg-enum", Object.getOwnPropertyDescriptor(Error.prototype,"message").enumerable); // false
p("tostr-enum", Object.getOwnPropertyDescriptor(Error.prototype,"toString").enumerable); // false
p("name-val", Error.prototype.name);        // Error
p("typeerr-name", TypeError.prototype.name); // TypeError
p("proto-keys", JSON.stringify(Object.keys(Error.prototype))); // []
p("toString-works", new TypeError("x").toString()); // TypeError: x
p("global-Error-enum", Object.getOwnPropertyDescriptor(globalThis,"Error").enumerable);     // false
p("global-TypeError-enum", Object.getOwnPropertyDescriptor(globalThis,"TypeError").enumerable); // false
p("global-Error-present", typeof globalThis.Error);  // function

var r = /ab/gi;
print("global=" + r.global + " ignoreCase=" + r.ignoreCase + " multiline=" + r.multiline);
print("source=" + r.source + " flags=" + r.flags + " sticky=" + r.sticky);
print("own-global=" + r.hasOwnProperty("global"));   // false: inherited getter
print("proto-get=" + (Object.getOwnPropertyDescriptor(RegExp.prototype, "source").get.call(/x/)));
print("test=" + /bc/.test("abcd") + " exec=" + /b(c)/.exec("abcd")[1]);

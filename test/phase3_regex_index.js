var m = /b(c)/.exec("abcd");
print("exec=" + m[0] + "," + m[1] + ",idx=" + m.index + ",in=" + m.input);
var mm = "xabcd".match(/b(c)/);
print("match=" + mm[0] + ",idx=" + mm.index + ",in=" + mm.input);
print("nomatch=" + (/z/.exec("abc")));

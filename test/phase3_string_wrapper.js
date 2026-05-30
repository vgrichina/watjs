var s = new String("abc");
print("length=" + s.length);
print("idx=" + s[0] + s[1] + s[2]);
print("in=" + (1 in s) + "," + (3 in s));
print("filter=" + Array.prototype.filter.call(s, function(){return true;}).join(","));
var keys = []; for (var k in s) keys.push(k);
print("for-in=" + keys.join(","));

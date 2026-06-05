// String indexed by a numeric-string key + Object.keys/values/entries over strings
var s = "hi";
print(s["0"]);
print(s["1"]);
print(s["2"]);          // undefined (out of range)
var k = "0";
print(s[k]);
print(Object.keys("ab").join(","));
print(JSON.stringify(Object.values("hi")));
print(JSON.stringify(Object.entries("hi")));
print(Object.getOwnPropertyNames("ab").join(","));   // 0,1,length

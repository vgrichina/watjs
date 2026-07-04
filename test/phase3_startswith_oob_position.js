// String.prototype.startsWith clamps the position to [0, len] (spec: start = min(max(pos,0),len))
// and returns false when searchLength+start > len — no out-of-bounds read for pos=Infinity/huge.
var str = "The future is cool!";
if (str.startsWith("!", str.length) !== false) throw new Error("pos=len");
if (str.startsWith("!", 100) !== false) throw new Error("pos=100");
if (str.startsWith("!", Infinity) !== false) throw new Error("pos=Infinity");    // was a memory-OOB trap
if (str.startsWith("The future", -1) !== true) throw new Error("pos=-1");
if (str.startsWith("The future", -Infinity) !== true) throw new Error("pos=-Infinity");
if ("abc".startsWith("", Infinity) !== true) throw new Error("empty search at Infinity");
if ("abc".startsWith("abc", 0) !== true) throw new Error("full match");
if ("abcdef".startsWith("cd", 2) !== true) throw new Error("mid match");
print("ok");

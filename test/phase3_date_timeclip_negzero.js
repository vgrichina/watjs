// TimeClip flushes -0 to +0 (ToInteger(time) + (+0)).
if (!Object.is(new Date(-0).getTime(), 0)) throw new Error("ctor -0 must be +0");
if (Object.is(new Date(-0).getTime(), -0)) throw new Error("must not be -0");
var d = new Date(0); d.setTime(-0);
if (!Object.is(d.getTime(), 0)) throw new Error("setTime -0 must be +0");
// truncation toward zero is preserved
if (new Date(6.9).valueOf() !== 6) throw new Error("trunc +");
if (new Date(-6.9).valueOf() !== -6) throw new Error("trunc -");
print("ok");

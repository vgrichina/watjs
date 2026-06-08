// Array.prototype.slice: an explicitly-undefined end defaults to length (not 0).
var x = [0, 1, 2, 3, 4];
if (JSON.stringify(x.slice(3, undefined)) !== "[3,4]") throw new Error("undefined end");
if (JSON.stringify(x.slice(undefined, 2)) !== "[0,1]") throw new Error("undefined start");
if (JSON.stringify(x.slice()) !== "[0,1,2,3,4]") throw new Error("no args");
if (JSON.stringify(x.slice(1)) !== "[1,2,3,4]") throw new Error("start only");
if (JSON.stringify(x.slice(-2)) !== "[3,4]") throw new Error("negative start");
if (JSON.stringify(x.slice(1, 3)) !== "[1,2]") throw new Error("both");
if (JSON.stringify(x.slice(1, -1)) !== "[1,2,3]") throw new Error("negative end");
print("ok");

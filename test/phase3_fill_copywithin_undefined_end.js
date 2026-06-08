// fill / copyWithin: an undefined end defaults to length (not 0).
if (JSON.stringify([1, 2, 3, 4].fill(0, 1, undefined)) !== "[1,0,0,0]") throw new Error("fill undefined end");
if (JSON.stringify([1, 2, 3, 4].fill(0, undefined, 2)) !== "[0,0,3,4]") throw new Error("fill undefined start");
if (JSON.stringify([1, 2, 3, 4].fill(9)) !== "[9,9,9,9]") throw new Error("fill value only");
if (JSON.stringify([1, 2, 3, 4].copyWithin(0, 2, undefined)) !== "[3,4,3,4]") throw new Error("copyWithin undefined end");
if (JSON.stringify([1, 2, 3, 4, 5].copyWithin(0, 3)) !== "[4,5,3,4,5]") throw new Error("copyWithin no end");
print("ok");

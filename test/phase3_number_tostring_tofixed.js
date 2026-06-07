// toString with undefined (or absent) radix defaults to base 10; toFixed returns
// ToString for |x| >= 1e21.
if ((255).toString(undefined) !== "255") throw new Error("toString(undefined)");
if (Number.prototype.toString(undefined) !== "0") throw new Error("proto toString(undefined)");
if ((255).toString() !== "255") throw new Error("toString()");
if ((255).toString(16) !== "ff") throw new Error("toString(16)");
if ((1e21).toFixed(1) !== "1e+21") throw new Error("toFixed 1e21: " + (1e21).toFixed(1));
if ((1e21).toFixed(1) !== String(1e21)) throw new Error("toFixed === String");
if ((1.5).toFixed(0) !== "2") throw new Error("toFixed normal");
print("ok");

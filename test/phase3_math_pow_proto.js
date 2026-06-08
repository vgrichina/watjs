// Math.pow |base|==1 with huge FINITE exponent (not Infinity) and Math/JSON/Reflect [[Prototype]]
if (Math.pow(1, -2147483648) !== 1) throw "pow(1,INT32_MIN)";
if (Math.pow(1, 1e308) !== 1) throw "pow(1,huge)";
if (Math.pow(-1, -2147483648) !== 1) throw "pow(-1,even-huge)";
if (Math.pow(2, -2147483648) !== 0) throw "pow(2,INT32_MIN)";
if (!Number.isNaN(Math.pow(1, Infinity))) throw "pow(1,Inf) must be NaN";
if (!Number.isNaN(Math.pow(1, -Infinity))) throw "pow(1,-Inf) must be NaN";
if (Object.getPrototypeOf(Math) !== Object.prototype) throw "Math proto";
if (Object.getPrototypeOf(JSON) !== Object.prototype) throw "JSON proto";
if (Object.getPrototypeOf(Reflect) !== Object.prototype) throw "Reflect proto";
print("ok");

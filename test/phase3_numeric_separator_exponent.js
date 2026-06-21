if (1e1_0 !== 1e10) throw "exp-sep: " + 1e1_0;
if (1_0e1_0 !== 1e11) throw "mantissa+exp-sep: " + 1_0e1_0;
if (1.5e1_0 !== 1.5e10) throw "frac+exp-sep";
if (1e-1_0 !== 1e-10) throw "neg-exp-sep";
if (1_0 !== 10) throw "mantissa-sep";
if (0x1_0 !== 16) throw "hex-sep";
print("ok");

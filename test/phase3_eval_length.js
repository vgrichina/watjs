// eval.length is 1
if (eval.length !== 1) throw new Error("eval.length should be 1, got " + eval.length);
if (eval.name !== "eval") throw new Error("eval.name");
print("ok");

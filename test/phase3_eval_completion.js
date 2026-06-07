// A program/eval whose last statement has an empty completion (var/let/function
// decl, block, empty source) completes to undefined — the compiled-in prelude must
// not leak its trailing expression value into the completion register.
if (eval("") !== undefined) throw new Error("empty");
if (eval("var x") !== undefined) throw new Error("var");
if (eval("let q") !== undefined) throw new Error("let");
if (eval("function f(){}") !== undefined) throw new Error("function decl");
if (eval("{ }") !== undefined) throw new Error("block");
if (Boolean(eval("var x")) !== false) throw new Error("Boolean(var)");
// expression statements still produce their value
if (eval("1+1") !== 2) throw new Error("expr");
if (eval("1;var y") !== 1) throw new Error("expr then var");
if (eval("var z=5; z*2") !== 10) throw new Error("trailing expr");
print("ok");

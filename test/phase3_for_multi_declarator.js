// A C-style for-loop head may declare multiple comma-separated declarators
// (`for (var a=0, b=0; ...)`), with or without initializers, for var/let/const.

// var, multiple declarators with initializers
var sum = 0;
for (var a = 0, b = 10; a < 3; a++, b++) sum += a + b;
if (sum !== 36) throw new Error("var multi: " + sum);        // (0+10)+(1+11)+(2+12)=36
if (a !== 3 || b !== 13) throw new Error("var multi final: a=" + a + " b=" + b);

// let, multiple declarators — block-scoped (do not leak)
for (let c = 1, d = 2; c < 2; c++) { if (c + d !== 3) throw new Error("let multi body"); }
var leaked = false;
try { c; leaked = true; } catch (e) {}
try { d; leaked = true; } catch (e) {}
if (leaked) throw new Error("let multi head leaked");

// const, multiple declarators
var prod = 1;
for (const e = 3, f = 4; prod === 1;) { prod = e * f; break; }
if (prod !== 12) throw new Error("const multi: " + prod);

// mixed init / no-init declarators
for (var g, h = 5, i; h < 6; h++) { if (g !== undefined || i !== undefined) throw new Error("no-init should be undefined"); }
if (h !== 6) throw new Error("mixed final h=" + h);

// no-init let declarators bind undefined in the loop scope
for (let j, k = 7; k < 8; k++) { if (j !== undefined) throw new Error("let no-init j"); if (k !== 7) throw new Error("let k"); }

// destructuring + simple declarators together
var acc = "";
for (let [x, y] = [1, 2], z = 3; x < 2; x++) acc += x + "" + y + z;
if (acc !== "123") throw new Error("destructuring multi: " + acc);

// single declarator still works (regression guard)
var single = 0;
for (var s = 0; s < 5; s++) single += s;
if (single !== 10) throw new Error("single declarator: " + single);

print("ok");

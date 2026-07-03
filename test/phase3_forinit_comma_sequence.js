// A comma sequence expression in the for-init (no var/let/const) is valid ES —
// `for (a = 0, b = 0; …)`. It was silently mis-parsed (only the first assignment
// consumed, leaving `, b = 0` before the `;` → parse failure that produced no output).
var a, b, c;

// two-assignment init
for (a = 1, b = 2; a < 3; a++) {}
if (a !== 3 || b !== 2) throw new Error("two-assignment init: a=" + a + " b=" + b);

// three-assignment init
for (a = 10, b = 20, c = 30; a < 11; a++) {}
if (a !== 11 || b !== 20 || c !== 30) throw new Error("three-assignment init: " + a + "," + b + "," + c);

// comma init together with comma update
for (a = 1, b = 1; a < 4; a++, b = b * 2) {}
if (a !== 4 || b !== 8) throw new Error("comma init + comma update: a=" + a + " b=" + b);

// side effects run left-to-right in the init
var log = "";
for (a = (log += "a", 0), b = (log += "b", 0); a < 1; a++) {}
if (log !== "ab") throw new Error("init eval order: " + log);

// a single-assignment init still works (fast path unchanged)
for (a = 0; a < 5; a++) {}
if (a !== 5) throw new Error("single init: " + a);

print("ok");

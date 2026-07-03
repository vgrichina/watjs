// A regex literal inside a template substitution `${ ... /re/ ... }` must be
// skipped as a unit when the lexer scans for the closing `}`. A regex containing
// a quote (e.g. /'/g) previously mis-parsed: the `'` was treated as a string
// delimiter, swallowing text past the substitution → silent whole-program failure.
var s = "a'b'c";
if (`${s.replace(/'/g, "X")}` !== "aXbXc") throw new Error("regex-with-quote in ${}");

// regex with a double-quote
var t = 'x"y';
if (`${t.replace(/"/g, "Z")}` !== "xZy") throw new Error("regex-with-dquote in ${}");

// regex with braces/brackets inside a character class
if (`${"a{b}c".replace(/[{}]/g, "_")}` !== "a_b_c") throw new Error("regex braces/class in ${}");

// division inside a substitution must still be division, not a regex
if (`${6 / 2}` !== "3") throw new Error("division in ${}");
var n = 10;
if (`${n / 2 + 1}` !== "6") throw new Error("division expr in ${}");

// regex after operand-ending tokens vs operator tokens
if (`${[1, 2].join("") + "z"}` !== "12z") throw new Error("array-join in ${}");

// nested: regex inside a substitution inside a nested template
if (`${`${"a'b".replace(/'/g, "-")}`}` !== "a-b") throw new Error("nested template regex");

print("ok");

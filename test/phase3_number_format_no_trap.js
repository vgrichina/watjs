// Number.prototype.toFixed and toString(radix) must not trap on large arguments.
// toFixed: fractionDigits up to 100 (i32 digit-extraction overflowed → trap for d>=10).
if ((1.5).toFixed(10) !== "1.5000000000") throw new Error("toFixed(10): " + (1.5).toFixed(10));
if ((1.5).toFixed(18) !== "1.500000000000000000") throw new Error("toFixed(18)");
if ((1.5).toFixed(20) !== "1.50000000000000000000") throw new Error("toFixed(20)");
if ((123.456).toFixed(2) !== "123.46") throw new Error("toFixed round");
if ((2.5).toFixed(0) !== "3") throw new Error("toFixed(0) round-half-up");
if ((0).toFixed(7) !== "0.0000000") throw new Error("zero toFixed");
if ((-1.25).toFixed(1) !== "-1.3" && (-1.25).toFixed(1) !== "-1.2") throw new Error("neg toFixed");

// toString(radix) on huge values (integer part exceeds i32 → trap).
if ((255).toString(2) !== "11111111") throw new Error("255 base2");
if ((255).toString(16) !== "ff") throw new Error("255 base16");
if ((3.5).toString(2) !== "11.1") throw new Error("3.5 base2");
if ((0).toString(2) !== "0") throw new Error("0 base2");
if ((-255).toString(2) !== "-11111111") throw new Error("neg base2");
if (typeof (1e300).toString(2) !== "string" || (1e300).toString(2).length < 900) throw new Error("1e300 base2 length");
if ((1e30).toString(16).charAt(0) !== "c") throw new Error("1e30 base16");

print("ok");

// ToNumber(string) strips all WhiteSpace/LineTerminator, including UTF-8 Unicode
// spaces (NBSP, ideographic space, line/para separators, BOM), leading and trailing.
if (Number(" 5 ") !== 5) throw new Error("ascii");
if (Number(" 5 ") !== 5) throw new Error("NBSP");
if (Number("　5") !== 5) throw new Error("ideographic");
if (Number(" 5") !== 5) throw new Error("line sep");
if (Number("﻿5") !== 5) throw new Error("BOM");
if (Number("5 ") !== 5) throw new Error("trailing em space");
if (Number(" 　 ") !== 0) throw new Error("all-ws → 0");
if (Number("") !== 0) throw new Error("empty → 0");
print("ok");

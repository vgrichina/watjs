// Number.parseInt and Number.parseFloat are the very same function objects as the globals.
if (Number.parseInt !== parseInt) throw new Error("parseInt identity");
if (Number.parseFloat !== parseFloat) throw new Error("parseFloat identity");
if (Number.parseInt("0x1F") !== 31) throw new Error("parseInt works");
if (Number.parseFloat("3.14xyz") !== 3.14) throw new Error("parseFloat works");
print("ok");

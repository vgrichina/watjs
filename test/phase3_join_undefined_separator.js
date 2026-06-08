// Array.prototype.join: an undefined separator defaults to "," (not "undefined").
if ([0, 1, 2, 3].join(undefined) !== "0,1,2,3") throw new Error("undefined sep");
if ([0, 1, 2, 3].join() !== "0,1,2,3") throw new Error("no arg");
if ([0, 1, 2, 3].join("-") !== "0-1-2-3") throw new Error("custom sep");
if ([1, 2, 3].join("") !== "123") throw new Error("empty sep");
if ([1, null, 3, undefined].join("|") !== "1||3|") throw new Error("null/undefined elements");
print("ok");

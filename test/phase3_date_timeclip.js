// TimeClip: dates beyond ±8.64e15 ms become NaN; the boundary stays valid
if (!Number.isNaN(new Date(0).setFullYear(300000))) throw new Error("setFullYear overflow");
if (!Number.isNaN(Date.UTC(300000, 0))) throw new Error("Date.UTC overflow");
if (!Number.isNaN(new Date(275761, 0, 1).getTime())) throw new Error("ctor overflow");
if (!Number.isNaN(new Date(275760, 8, 14).getTime())) throw new Error("ctor just-over");
if (new Date(275760, 8, 13).getTime() !== 8640000000000000) throw new Error("max boundary");
if (new Date(0).getTime() !== 0) throw new Error("epoch");
print("ok");

// MakeDay normalizes month overflow into the year; toISOString uses signed 6-digit
// years outside 0..9999.
if (Date.UTC(2016, 12) !== 1483228800000) throw new Error("month 12");
if (Date.UTC(2016, 144) !== 1830297600000) throw new Error("month 144");
if (Date.UTC(2016, 0, 33) !== 1454371200000) throw new Error("day overflow");
if (Date.UTC(2016, 2, -27) !== 1454371200000) throw new Error("day negative");
if (new Date(8640000000000000).toISOString() !== "+275760-09-13T00:00:00.000Z") throw new Error("max ISO");
if (new Date(-8640000000000000).toISOString() !== "-271821-04-20T00:00:00.000Z") throw new Error("min ISO");
if (new Date(0).toISOString() !== "1970-01-01T00:00:00.000Z") throw new Error("epoch ISO");
print("ok");

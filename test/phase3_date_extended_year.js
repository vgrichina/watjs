// ISO extended years: signed 6-digit years parse; negative years serialize with
// a leading '-' and >=4 digits; "-000000" (negative zero) is invalid.
if ((new Date('-000001-07-01T00:00Z')).toString().split(' ')[3] !== '-0001') throw new Error("toString -1");
if ((new Date('-123456-07-01T00:00Z')).toString().split(' ')[3] !== '-123456') throw new Error("toString -123456");
if ((new Date('-001234-07-01T00:00Z')).toDateString().split(' ')[3] !== '-1234') throw new Error("toDateString");
if (!Number.isNaN(+new Date('-000000-03-31T00:45Z'))) throw new Error("negative-zero year must be NaN");
if (Number.isNaN(+new Date('+002020-01-01T00:00Z'))) throw new Error("positive extended year valid");
print("ok");

// Invalid-Date setters: read [[DateValue]] first, coerce all args (side effects run),
// then return NaN without overwriting the slot.
var d = new Date(NaN);
if (!Number.isNaN(d.setHours(0))) throw new Error("setHours ret");
if (!Number.isNaN(d.getTime())) throw new Error("setHours slot");
// setFullYear is the exception: NaN this-time becomes +0 and the call proceeds
if (Number.isNaN(new Date(NaN).setFullYear(2020, 1, 1))) throw new Error("setFullYear should proceed from +0");
// valueOf side-effect mutates the slot; captured t (NaN) still drives the NaN return
var dt = new Date(NaN), c = 0;
var v = { valueOf: function () { c++; dt.setTime(0); return 1; } };
if (!Number.isNaN(dt.setHours(v))) throw new Error("result not NaN");
if (c !== 1) throw new Error("valueOf count " + c);
if (dt.getTime() !== 0) throw new Error("slot should reflect setTime, got " + dt.getTime());
print("ok");

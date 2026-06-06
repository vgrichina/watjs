// SameValue in [[DefineOwnProperty]] + deopt seeds an existing element's attrs.
function p(n, v) { print(n + "=" + v); }

// redefining a non-writable data property with the SAME NaN value is allowed
var o = {}; Object.defineProperty(o, "foo", { value: NaN });
var e1 = "ok"; try { Object.defineProperty(o, "foo", { value: NaN }); } catch (e) { e1 = "threw"; }
p("nan-obj", e1);
var a = []; Object.defineProperty(a, "0", { value: NaN });
var e2 = "ok"; try { Object.defineProperty(a, "0", { value: NaN }); } catch (e) { e2 = "threw"; }
p("nan-arr", e2);

// deopting an existing dense element preserves its implicit W|E|C:true for the
// attributes the new descriptor doesn't mention
var b = [5, 6, 7];
Object.defineProperty(b, "0", { value: 10, writable: false });
var d = Object.getOwnPropertyDescriptor(b, "0");
p("seed", d.enumerable + "," + d.configurable + "," + d.writable + ",v=" + d.value); // true,true,false,v=10
// still configurable → a value change via defineProperty is allowed
var e3 = "ok"; try { Object.defineProperty(b, "0", { value: 20 }); } catch (e) { e3 = "threw"; }
p("redef", e3 + ",v=" + b[0]); // ok,v=20

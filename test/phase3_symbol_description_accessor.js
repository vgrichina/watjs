// Symbol.prototype.description is a getter accessor (not own), unboxes wrappers,
// brand-checks, and is undefined for a descriptionless symbol.
var d = Object.getOwnPropertyDescriptor(Symbol.prototype, "description");
if (typeof d.get !== "function") throw new Error("getter");
if (d.set !== undefined) throw new Error("no setter");
if (d.enumerable !== false || d.configurable !== true) throw new Error("attrs");
if (Symbol("test").description !== "test") throw new Error("primitive");
if (Object(Symbol("test")).description !== "test") throw new Error("wrapper");
if (Symbol().description !== undefined) throw new Error("absent → undefined");
var threw = false;
try { d.get.call({}); } catch (e) { threw = e instanceof TypeError; }
if (!threw) throw new Error("brand check on non-symbol");
print("ok");

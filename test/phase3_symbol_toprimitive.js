// Symbol.prototype[@@toPrimitive] returns the symbol primitive (any hint), so
// coercing a Symbol wrapper to a primitive yields the symbol (→ ToString/ToNumber throw).
if (typeof Symbol.prototype[Symbol.toPrimitive] !== "function") throw new Error("missing");
var s = Symbol("q");
if (Symbol.prototype[Symbol.toPrimitive].call(s) !== s) throw new Error("primitive");
if (Symbol.prototype[Symbol.toPrimitive].call(Object(s)) !== s) throw new Error("wrapper unbox");
// ToString of a Symbol wrapper throws (via @@toPrimitive → symbol → ToString)
var threw = false;
try { "".indexOf(Object(Symbol("1"))); } catch (e) { threw = e instanceof TypeError; }
if (!threw) throw new Error("indexOf Object(Symbol) should throw");
// descriptor {W:false,E:false,C:true}
var d = Object.getOwnPropertyDescriptor(Symbol.prototype, Symbol.toPrimitive);
if (d.writable !== false || d.enumerable !== false || d.configurable !== true) throw new Error("descriptor");
// String(symbol) still works (special-cased)
if (String(Symbol("z")) !== "Symbol(z)") throw new Error("String(symbol)");
print("ok");

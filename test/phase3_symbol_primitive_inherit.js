// A primitive symbol inherits Object.prototype methods and resolves @@toPrimitive.
if (Symbol().hasOwnProperty("description") !== false) throw new Error("hasOwnProperty");
if (typeof Symbol()[Symbol.toPrimitive] !== "function") throw new Error("@@toPrimitive present");
// Symbol.toPrimitive is itself a symbol; calling its @@toPrimitive returns it
if (Symbol.toPrimitive[Symbol.toPrimitive]() !== Symbol.toPrimitive) throw new Error("this-val-symbol");
if (Symbol("a").toString() !== "Symbol(a)") throw new Error("toString");
if (Symbol("a").valueOf() !== Symbol.prototype.valueOf.call(Symbol("a").valueOf())) {
  /* valueOf returns the same primitive */
}
print("ok");

// ToNumber(Symbol) throws a TypeError (unary +, arithmetic, Number(), relational).
function thrown(f) {
  try { f(); return "no-throw"; } catch (e) { return e.constructor.name; }
}
print("unary-plus=" + thrown(function () { return +Symbol(); }));
print("multiply=" + thrown(function () { return Symbol() * 2; }));
print("Number=" + thrown(function () { return Number(Symbol()); }));
print("relational=" + thrown(function () { return Symbol() < 1; }));
print("array-fill=" + thrown(function () { return [1, 2].fill(0, Symbol()); }));

// ToString(Symbol) also throws via + and templates...
print("concat=" + thrown(function () { return "x" + Symbol(); }));
print("template=" + thrown(function () { return `${Symbol()}`; }));

// but symbol == number is just false (no coercion, no throw)
print("loose-eq=" + (Symbol() == 1));
// and String(symbol) (explicit) / typeof stay lenient
print("String=" + String(Symbol("d")));
print("typeof=" + typeof Symbol());

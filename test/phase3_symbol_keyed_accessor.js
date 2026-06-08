// Object-literal computed accessors with a SYMBOL key (get [s]()/set [s]()) are
// defined and invoked under that symbol (DEFGET/DEFSET use to_prop_key, not to_str).
var s = Symbol();
var store;
var t = { get [s]() { return 7; }, set [s](v) { store = v; } };
var d = Object.getOwnPropertyDescriptor(t, s);
if (typeof d.get !== "function" || typeof d.set !== "function") throw new Error("descriptor");
if (t[s] !== 7) throw new Error("getter");
t[s] = 42;
if (store !== 42) throw new Error("setter");
// Object.assign invokes a symbol-keyed setter on a frozen target
var sym = Symbol(); var got = 1;
var target = Object.freeze({ set [sym](v) { got = v; } });
Object.assign(target, { [sym]: 2 });
if (got !== 2) throw new Error("assign to frozen symbol accessor");
print("ok");

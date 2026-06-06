// Private class fields/methods #x (string-key model: functional, non-enumerable).
function p(n, v) { print(n + "=" + v); }
class C { #x = 5; #m() { return this.#x * 2; } getX() { return this.#x; } dbl() { return this.#m(); } }
var c = new C();
p("field", c.getX());                  // 5
p("method", c.dbl());                   // 10
p("not-enum", Object.keys(c).join(",")); // (empty)
p("json", JSON.stringify(c));           // {}

class D { #v = 1; inc() { this.#v++; return this.#v; } static has(o) { return #v in o; } }
var d = new D();
p("mutate", d.inc());                   // 2
p("brand-yes", D.has(d));               // true
p("brand-no", D.has({}));               // false

class S { static #s = 7; static get() { return S.#s; } }
p("static", S.get());                   // 7

class G { #val = 42; get value() { return this.#val; } set value(v) { this.#val = v; } }
var g = new G(); g.value = 99;
p("accessor", g.value);                 // 99

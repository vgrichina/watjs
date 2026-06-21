class C {
  #f = 1;
  #m() { return this.#f; }
  get #g() { return 2; }
  static #sf = 3;
  static #sm() { return 4; }
  useF(){ return this.#f; }
  useM(){ return this.#m(); }
  useG(){ return this.#g; }
  static useS(){ return C.#sf + C.#sm(); }
  brand(o){ return #f in o; }
}
var c = new C();
// private access works
if (c.useF() !== 1) throw "useF";
if (c.useM() !== 1) throw "useM";
if (c.useG() !== 2) throw "useG";
if (C.useS() !== 7) throw "useS";
// brand check works
if (!c.brand(c)) throw "brand-true";
if (c.brand({})) throw "brand-false";
// invisible to reflection (string keys)
var P = C.prototype;
if (Object.prototype.hasOwnProperty.call(P, "#m")) throw "hasOwn #m";
if (Object.prototype.hasOwnProperty.call(c, "#f")) throw "hasOwn #f";
if (Object.prototype.hasOwnProperty.call(C, "#sf")) throw "hasOwn #sf";
if (Object.getOwnPropertyDescriptor(P, "#m") !== undefined) throw "gopd #m";
if (Object.getOwnPropertyDescriptor(c, "#f") !== undefined) throw "gopd #f";
if (P.propertyIsEnumerable("#m")) throw "pie #m";
if (Object.getOwnPropertyNames(P).indexOf("#m") >= 0) throw "gopn #m";
if (Object.getOwnPropertyNames(c).indexOf("#f") >= 0) throw "gopn #f";
if (Object.keys(c).indexOf("#f") >= 0) throw "keys #f";
print("ok");

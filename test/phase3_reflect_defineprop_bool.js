// Reflect.defineProperty returns a boolean (false on [[DefineOwnProperty]] failure),
// whereas Object.defineProperty throws on the same failure.
var o = {};
o.p1 = 'foo';
if (Reflect.defineProperty(o, 'p1', {}) !== true) throw "redefine existing → true";
if (Reflect.defineProperty(o, 'p2', {value: 42}) !== true) throw "add p2 → true";
if (o.p2 !== 42) throw "p2 value";
Object.freeze(o);
if (Reflect.defineProperty(o, 'p2', {value: 43}) !== false) throw "frozen redefine → false";
if (o.p2 !== 42) throw "p2 unchanged after failed define";
if (Reflect.defineProperty(o, 'p3', {}) !== false) throw "frozen add → false";
if (o.hasOwnProperty('p3')) throw "p3 should not exist";
// Object.defineProperty still THROWS on the same failure
var threw = false;
try { Object.defineProperty(o, 'p4', {value: 1}); } catch(e){ threw = e instanceof TypeError; }
if (!threw) throw "Object.defineProperty must throw on frozen add";
// non-configurable redefinition
var n = {};
Object.defineProperty(n, 'x', {value: 1, configurable: false});
if (Reflect.defineProperty(n, 'x', {value: 2}) !== false) throw "non-config redefine → false";
if (Reflect.defineProperty(n, 'x', {value: 1}) !== true) throw "same-value redefine → true";
print("ok");

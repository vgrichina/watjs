// (1) A generator method/function receives `this` from the call site (captured at
// generator-creation time, restored on each resume).
var obj = { v: 99, *gen() { yield this.v; yield this.v + 1; } };
var it = obj.gen();
assert(it.next().value === 99, "generator method this.v");
assert(it.next().value === 100, "generator resume keeps this");
function* g() { yield this.x; }
var o2 = { x: 7, g: g };
assert(o2.g().next().value === 7, "generator-as-property this");

// (2) Array destructuring / for-of / spread honor an overridden
// Array.prototype[Symbol.iterator] (GetIterator calls @@iterator, not a fast path).
Array.prototype[Symbol.iterator] = function* () {
  if (this.length > 0) yield this[0];
  if (this.length > 1) yield this[1];
  if (this.length > 2) yield 42;
};
var [x, y, z] = [1, 2, 3];
assert(x === 1 && y === 2 && z === 42, "destructuring uses overridden @@iterator");
var n = 0; for (var e of [1, 2, 3]) n += e;
assert(n === 1 + 2 + 42, "for-of uses overridden @@iterator");
var s = [...[1, 2, 3]];
assert(s[2] === 42, "spread uses overridden @@iterator");
delete Array.prototype[Symbol.iterator];  // restore for any later tests in this file

// (3) A generator has its own `arguments` object.
function* ga() { yield arguments.length; yield arguments[0]; }
var ita = ga(7, 8, 9);
assert(ita.next().value === 3, "generator arguments.length");
assert(ita.next().value === 7, "generator arguments[0]");

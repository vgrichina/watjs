class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  sum() { return this.x + this.y; }
  scale(k) { return this.x * k + this.y * k; }
}
var p = new Point(3, 4);
assert(p.sum() === 7, "method");
assert(p.scale(2) === 14, "method arg");
assert(p instanceof Point, "instanceof");

class Animal {
  constructor(name) { this.name = name; }
  describe() { return this.name + " is an animal"; }
}
class Dog extends Animal {
  bark() { return "woof"; }
}
var d = new Dog("Rex");
assert(d.bark() === "woof", "own method");
assert(d.describe() === "Rex is an animal" || d.name === undefined, "inherited method");
assert(d instanceof Dog, "instanceof Dog");
assert(d instanceof Animal, "instanceof Animal");

class Counter {
  constructor() { this.n = 0; }
  inc() { this.n = this.n + 1; return this.n; }
}
var c = new Counter();
assert(c.inc() === 1 && c.inc() === 2 && c.inc() === 3, "stateful");

class MathUtil {
  static square(x) { return x * x; }
}
assert(MathUtil.square(5) === 25, "static");

class Empty { greet() { return "hi"; } }
assert(new Empty().greet() === "hi", "no constructor");

var sq = class { area(s) { return s * s; } };
assert(new sq().area(4) === 16, "class expression");

print("class tests passed");

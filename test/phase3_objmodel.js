function Point(x, y) { this.x = x; this.y = y; }
Point.prototype.sum = function () { return this.x + this.y; };
Point.prototype.kind = "point";
var p = new Point(3, 4);
print(p.x);
print(p.y);
print(p.sum());
print(p.kind);
print(p instanceof Point);
print(p instanceof Point === true);

var obj = {
  base: 10,
  add: function (n) { return this.base + n; }
};
print(obj.add(5));

function Animal(name) { this.name = name; }
Animal.prototype.speak = function () { return this.name + " speaks"; };
var a = new Animal("cat");
print(a.speak());
print(a instanceof Animal);
print(a instanceof Point);

function Test262Error(message) {
  if (!(this instanceof Test262Error)) return new Test262Error(message);
  this.message = message || "";
}
var e = new Test262Error("boom");
print(e.message);
print(e instanceof Test262Error);

// function as object with properties
function ns() {}
ns.helper = function (x) { return x * 2; };
print(ns.helper(21));

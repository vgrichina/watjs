function add(a, b) { return a + b; }
print(add(3, 4));
function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
}
print(fact(5));
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}
print(fib(10));
var square = function(x) { return x * x; };
print(square(9));
function makeAdder(x) {
  return function(y) { return x + y; };
}
var add10 = makeAdder(10);
print(add10(5));
print(add10(100));
function makeCounter() {
  var c = 0;
  return function() { c = c + 1; return c; };
}
var counter = makeCounter();
print(counter());
print(counter());
print(counter());
function noReturn() { var z = 5; }
print(noReturn());

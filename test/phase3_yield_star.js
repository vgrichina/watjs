function* inner() { yield 1; yield 2; }
function* outer() { yield 0; yield* inner(); yield 3; }
print("nested=" + JSON.stringify([...outer()]));
function* arr() { yield* [10, 20]; }
var it = arr();
print("a1=" + JSON.stringify(it.next()));
print("a2=" + JSON.stringify(it.next()));
print("a3=" + JSON.stringify(it.next()));

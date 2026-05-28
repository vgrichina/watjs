print(typeof 42);
print(typeof "hi");
print(typeof true);
print(typeof undefined);
print(typeof undefinedVar);
print(typeof print);
print(typeof {});
print(typeof [1,2]);
var sum = 0;
for (var i = 0; i < 10; i++) {
  if (i === 5) break;
  if (i % 2 === 0) continue;
  sum += i;
}
print(sum);
var n = 0;
do { n++; } while (n < 5);
print(n);
var found = -1;
var arr = [4, 8, 15, 16, 23];
for (var j = 0; j < arr.length; j++) {
  if (arr[j] === 15) { found = j; break; }
}
print(found);
var c = 0;
while (true) { c++; if (c >= 3) break; }
print(c);

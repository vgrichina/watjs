var x = 1;
{
  var x = 2;
  print(x);
}
print(x);
var n = 0;
var acc = 0;
while (n < 3) {
  let local = n * 10;
  acc = acc + local;
  n = n + 1;
}
print(acc);

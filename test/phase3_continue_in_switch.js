// `continue` inside a switch inside a loop targets the enclosing loop. Previously
// the switch dropped the continue-jump from the loop's patch list → unpatched JMP →
// OOB trap. Verify it works and reaches the loop condition.
var n = 0;
for (var i = 0; i < 3; i++) {
  switch (i) {
    case 1: continue;
    default: n++;
  }
}
assert(n === 2, "continue in switch in for: " + n);

var c = 0, j = 0;
while (j < 3) {
  j++;
  switch (j) {
    case 2: continue;
    default: c++;
  }
}
assert(c === 2, "continue in switch in while: " + c);

var k = 0, d = 0;
do {
  k++;
  switch (k) {
    case 1: continue;
    default: d++;
  }
} while (k < 3);
assert(d === 2, "continue in switch in do-while: " + d);

// break inside switch still only exits the switch, not the loop
var b = 0;
for (var m = 0; m < 3; m++) { switch (m) { case 0: break; default: ; } b++; }
assert(b === 3, "break in switch exits switch only: " + b);

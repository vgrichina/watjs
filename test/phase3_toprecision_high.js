// toPrecision / toExponential with high precision (>17 digits) must not trap
print((7).toPrecision(21));
print((7).toPrecision(20));
print((7).toPrecision(1));
print((7).toPrecision(3));
print((-7).toPrecision(19));
print((123.456).toPrecision(5));
print((10).toPrecision(2));
print((0).toPrecision(5));
print((5).toExponential(20));
print((1).toExponential(0));
print((123.456).toExponential(2));

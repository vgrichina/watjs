// RegExp.prototype.test with the sticky 'y' flag: anchor at lastIndex, update
// lastIndex to match-end on success / 0 on failure (mirrors exec). Global too.
var r = /abc/y;
if (r.test('abc') !== true || r.lastIndex !== 3) throw "sticky match+lastIndex";
var r2 = /c/y; r2.lastIndex = 1;
if (r2.test('abc') !== false || r2.lastIndex !== 0) throw "sticky fail resets lastIndex";
var r3 = /./y; r3.lastIndex = 1;
if (r3.test('a') !== false) throw "sticky past-end";
var r4 = /a/y;
if (r4.test('abc') !== true || r4.lastIndex !== 1) throw "sticky advance";
// non-global, non-sticky: lastIndex is ignored and untouched
var r5 = /b/; r5.lastIndex = 5;
if (r5.test('abc') !== true || r5.lastIndex !== 5) throw "plain regex lastIndex untouched";
// global still works
var r6 = /a/g; r6.lastIndex = 2;
if (r6.test('abcabc') !== true || r6.lastIndex !== 4) throw "global";
print("ok");

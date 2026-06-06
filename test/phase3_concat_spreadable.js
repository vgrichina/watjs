// Array.prototype.concat: IsConcatSpreadable (arrays + @@isConcatSpreadable).
function p(n, v) { print(n + "=" + v); }

p("basic", [1, 2].concat([3, 4], 5).join(","));         // 1,2,3,4,5
p("nested", JSON.stringify([1].concat([[2]], 3)));       // [1,[2],3]

// a non-array object with @@isConcatSpreadable=true is spread
var o = { length: 2, 0: "a", 1: "b" }; o[Symbol.isConcatSpreadable] = true;
p("spreadable-obj", [0].concat(o).join(","));            // 0,a,b

// an array with @@isConcatSpreadable=false is NOT spread (pushed as one element)
var arr = [1, 2]; arr[Symbol.isConcatSpreadable] = false;
p("array-nospread", [0].concat(arr).length);             // 2

// a plain object is pushed as a single element
p("obj-element", JSON.stringify([0].concat({ x: 1 })));   // [0,{"x":1}]

// holes in a spread array are preserved
var h = [1, , 3];
p("holes", (1 in [9].concat(h)) + "," + (2 in [9].concat(h))); // false,true

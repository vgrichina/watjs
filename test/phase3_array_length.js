function t(f){try{f();return "no-throw";}catch(e){return e.constructor.name;}}
var a = [0, 1, 2, 3, 4];
a.length = 2;
print("shrink=" + a.join(",") + "|" + a.length);
a.length = 4;
print("grow=" + a.length + "|" + (3 in a));
var b = [1, 2, 3];
Object.defineProperty(b, "length", { value: 1 });
print("define=" + b.join(",") + "|" + b.length);
print("range-neg=" + t(function(){ [].length = -1; }));
print("range-frac=" + t(function(){ [].length = 1.5; }));
var c = [1, 2, 3]; c.length = 1; c.push(9);
print("trunc-push=" + c.join(","));

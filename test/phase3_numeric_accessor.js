function p(n,v){print(n+"="+v);}
var o = { get 3(){ return "three"; }, set 5(v){ this._v = v; }, get "x"(){ return "ex"; }, set "y"(v){ this._y=v; } };
p("num-getter", o[3]);        // three
o[5] = 9;
p("num-setter", o._v);        // 9
p("str-getter", o.x);         // ex
o.y = 4;
p("str-setter", o._y);        // 4
// numeric method still works
var m = { 7(){ return 70; } };
p("num-method", m[7]());      // 70
// descriptor of a numeric accessor
var d = Object.getOwnPropertyDescriptor(o, "3");
p("is-accessor", typeof d.get);  // function

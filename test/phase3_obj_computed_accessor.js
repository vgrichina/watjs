function p(n,v){print(n+"="+v);}
var k="x"; var o={ get [k](){ return 11; } };
p("get", o.x);
var k2="y"; var o2={ set [k2](v){ this._y=v; }, get [k2](){ return this._y; } };
o2.y=3; p("getset", o2.y);
var o3={ get z(){ return 5; } };
p("plain", o3.z);
var pre="d"; var o4={ get [pre+"k"](){ return 8; } };
p("concat", o4.dk);

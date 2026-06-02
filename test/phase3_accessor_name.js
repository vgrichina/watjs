function p(n,v){print(n+"="+v);}
var o={ get x(){return 1;}, set y(v){} };
p("obj-get", Object.getOwnPropertyDescriptor(o,"x").get.name);
p("obj-set", Object.getOwnPropertyDescriptor(o,"y").set.name);
class C { get foo(){return 1;} set bar(v){} }
p("cls-get", Object.getOwnPropertyDescriptor(C.prototype,"foo").get.name);
p("cls-set", Object.getOwnPropertyDescriptor(C.prototype,"bar").set.name);

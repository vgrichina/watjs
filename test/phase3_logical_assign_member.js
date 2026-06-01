function p(n,v){print(n+"="+v);}
var o={x:0}; o.x||=7; p("mem-or", o.x);
var o2={x:1}; o2.x&&=7; p("mem-and", o2.x);
var o3={x:undefined}; o3.x??=7; p("mem-nul", o3.x);
var o4={x:9}; var c=0; o4.x||=(c=1); p("skip", o4.x+","+c);
var a=[0]; a[0]||=3; p("idx-or", a[0]);
var a2=[1]; a2[0]??=3; p("idx-nul", a2[0]);
var o5={x:2}; o5.x**=3; p("mem-pow", o5.x);
var a3=[2]; a3[0]**=4; p("idx-pow", a3[0]);
var o6={a:{b:0}}; o6.a.b||=5; p("nested", o6.a.b);
var o7={x:10}; var r=(o7.x||=99); p("result", r+","+o7.x);

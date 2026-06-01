function p(n,v){print(n+"="+v);}
var a,b,c,x,y,r;
r=[a,b]=[1,2]; p("arr", a+","+b+"|"+JSON.stringify(r));
[a,b]=[b,a]; p("swap", a+","+b);
r=[[x],[y]]=[[3],[4]]; p("nested", x+","+y+"|"+JSON.stringify(r));
[c=9]=[]; p("default", c);
[a,...r]=[1,2,3]; p("rest", a+":"+JSON.stringify(r));
[,a]=[7,8]; p("hole", a);
r=({a,b:c}={a:5,b:6}); p("obj", a+","+c+"|"+JSON.stringify(r));
({a=11}={}); p("obj-def", a);
({a:{b:x}}={a:{b:12}}); p("obj-nested", x);
// literals unaffected
p("arrlit", [1,2,3].length);
p("paren", (2+3)*2);

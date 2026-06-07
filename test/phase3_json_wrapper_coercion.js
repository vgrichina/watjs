var rep = function(k,v){ if(v==='str'){ var n=new Number(42); n.toString=function(){throw 0;}; n.valueOf=function(){return 2;}; return n; } return v; };
print(JSON.stringify(['str'], rep));
print(JSON.stringify(new Number(8.5)));
var num=new Number(1); num.toString=function(){throw 0;}; num.valueOf=function(){return 3;};
print(JSON.stringify({a:1},null,num).split("\n")[1].length);
print(JSON.stringify({a:1},null,3).split("\n")[1].length);

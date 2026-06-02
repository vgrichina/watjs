function p(n,v){print(n+"="+v);}
var flag;
function mk(){flag=false;return{[Symbol.iterator](){var i=0;return{next(){return i<5?{value:i++,done:false}:{value:0,done:true};},return(){flag=true;return{done:true};}};}};}
var [x,y]=mk(); p("short-close", flag+" "+x+","+y);
var [a,...r]=mk(); p("rest-noclose", flag+" "+r.length);
var []=mk(); p("empty-close", flag);
p("arr", (function(){var [a,b]=[1,2,3];return a+","+b;})());
p("arr-rest", (function(){var [a,...r]=[1,2,3];return a+":"+r.join(",");})());
p("param", (function([a,b]){return a+b;})([3,4]));
p("string", (function(){var [a,b]="xyz";return a+b;})());

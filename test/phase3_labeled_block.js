function p(n,v){print(n+"="+v);}
p("block", (function(){var s="";L:{s+="a";break L;s+="b";}return s;})());
p("nested", (function(){var s="";A:{B:{s+="1";break A;s+="2";}s+="3";}return s;})());
p("labeled-if", (function(){var s="";L:if(true){s+="x";break L;s+="y";}return s;})());
p("loop-cont", (function(){var s="";O:for(var i=0;i<3;i++){for(var j=0;j<3;j++){if(j===1)continue O;s+=i;}}return s;})());
p("loop-break", (function(){var s="";L:for(var i=0;i<5;i++){if(i===2)break L;s+=i;}return s;})());
p("plain", (function(){var s="";for(var i=0;i<5;i++){if(i===2)break;s+=i;}return s;})());

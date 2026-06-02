function p(n,v){print(n+"="+v);}
p("cont", (function(){var f="";for(var i=0;i<3;i++){try{continue;}finally{f+=i;}}return f;})());
p("break", (function(){var f="";for(var i=0;i<3;i++){try{if(i===1)break;}finally{f+="x";}}return f;})());
p("break-while", (function(){var f="";var i=0;while(i<5){try{break;}finally{f+="F";}i++;}return f+i;})());
p("nest-inner", (function(){var s="";try{for(var i=0;i<2;i++){try{continue;}finally{s+="i";}}}finally{s+="o";}return s;})());
p("switch-break", (function(){var f="";switch(1){case 1: try{break;}finally{f+="s";} f+="X";}return f;})());
p("cont-double", (function(){var f="";for(var i=0;i<2;i++){try{try{continue;}finally{f+="a";}}finally{f+="b";}}return f;})());

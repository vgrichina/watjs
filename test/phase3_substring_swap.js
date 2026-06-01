function p(n,v){print(n+"="+v);}
p("normal", "hello".substring(1,3));
p("swap", "hello".substring(3,1));
p("neg-start", "hello".substring(-1,3));
p("one-arg", "hello".substring(2));
p("oob-end", "hello".substring(2,99));
p("swap-with-neg", "hello".substring(4,-1));
p("slice-noswap", "hello".slice(3,1)+"|");

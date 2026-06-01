function p(n,v){print(n+"="+v);}
p("plain", parseFloat("3.14"));
p("trailing", parseFloat("3.14abc"));
p("ws", parseFloat("  42.5  "));
p("exp", parseFloat("1e3xyz"));
p("hex-no", parseFloat("0x10"));
p("dot", parseFloat(".5"));
p("infinity", parseFloat("Infinityyy"));
p("none", parseFloat("abc"));
p("neg-exp", parseFloat("-2.5e-3q"));
p("int", parseFloat("42"));
p("leading-dot-sign", parseFloat("+.25!"));

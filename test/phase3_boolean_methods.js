function p(n,v){print(n+"="+v);}
p("true-toString", true.toString());
p("false-toString", false.toString());
p("true-valueOf", true.valueOf());
p("false-valueOf", false.valueOf());
p("constructor", true.constructor===Boolean);
p("missing-prop", true.xyz===undefined);
p("new-Boolean", new Boolean(true).valueOf());
p("typeof", typeof true.toString);

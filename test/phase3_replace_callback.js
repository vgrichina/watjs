function p(n,v){print(n+"="+v);}
p("groups", "ab".replace(/(a)(b)/, (m,p1,p2)=>p2+p1));
p("offset", "xabcy".replace(/abc/, (m,off)=>off));
p("nogroup", "abc".replace(/./g, c=>c.toUpperCase()));
p("string-arg", "ab".replace(/(a)/, (m,p1,off,s)=>s));
p("unmatched-grp", "ac".replace(/(a)(b)?(c)/, (m,p1,p2,p3)=>p1+"|"+p2+"|"+p3));
p("global-fn", "a1b2".replace(/(\w)(\d)/g, (m,l,d)=>d+l));
p("global-str", "a1b2".replace(/(\w)(\d)/g, "$2$1"));

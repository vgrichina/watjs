function p(n,v){print(n+"=["+v+"]");}
p("plain", "  a  ".trim());
p("tab-nl", "\t\n\r\v\f a \t\n".trim());
p("nbsp", "\u00A0a\u00A0".trim());
p("ls-ps", "\u2028a\u2029".trim());
p("bom", "\uFEFFa\uFEFF".trim());
p("ideographic", "\u3000a\u3000".trim());
p("mixed", "\u00A0\t \u2028 a \n\u3000".trim());
p("trimStart", "\u00A0a\u00A0".trimStart());
p("trimEnd", "\u00A0a\u00A0".trimEnd());
p("empty", "\u00A0\u2028".trim());
p("none", "abc".trim());
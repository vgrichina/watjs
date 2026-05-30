function tag(strings, ...values) { return strings.join("|") + "::" + values.join(","); }
print("basic=" + tag`a${1}b${2}c`);
print("raw=" + (function(s){return s.raw[0];})`x\ny`);
print("strraw=" + String.raw`p\tq${1}r`);
print("count=" + (function(s,...v){return s.length + "," + v.length;})`${1}${2}`);
print("plain=" + `sum=${3+4}`);
var o = { m(s){ return "method:" + s[0]; } };
print("member=" + o.m`hi`);

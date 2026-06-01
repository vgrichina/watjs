function bad(s){ try{ JSON.parse(s); return "NOTHROW"; }catch(e){ return e instanceof SyntaxError ? "SE" : e.name; } }
print("num=" + JSON.parse('-4.5e2'));
print("str=" + JSON.parse('"a\\u0041z"'));
print("lits=" + JSON.parse('true') + JSON.parse('null'));
print("obj=" + JSON.stringify(JSON.parse('  { "a" : 1 , "b" : [2,3] } ')));
print("arr=" + JSON.parse('[1,2,3]').join("-"));
print("dup=" + JSON.parse('{"a":1,"a":2}').a);
print("unquoted=" + bad('{a:1}'));
print("trailcomma=" + bad('[1,2,]'));
print("leadzero=" + bad('01'));
print("trailjunk=" + bad('1 2'));
print("empty=" + bad(''));
print("plus=" + bad('+5'));

// catch clause with a destructuring binding pattern (object/array, defaults, rest, nested)
try { throw {a:1, b:2}; } catch ({a, b}) { if (a!==1||b!==2) throw "obj"; }
try { throw [10, 20]; } catch ([x, y]) { if (x!==10||y!==20) throw "arr"; }
try { throw {a:1}; } catch ({a, c=99}) { if (a!==1||c!==99) throw "default"; }
try { throw {a:1,b:2,c:3}; } catch ({a, ...rest}) {
  if (a!==1 || rest.b!==2 || rest.c!==3 || 'a' in rest) throw "rest"; }
try { throw {p:{x:5}}; } catch ({p:{x}}) { if (x!==5) throw "nested"; }
try { throw [1,[2,3]]; } catch ([a,[b,c]]) { if (a!==1||b!==2||c!==3) throw "nested-arr"; }
// simple binding and no-binding still work
try { throw {a:7}; } catch (e) { if (e.a!==7) throw "plain"; }
var ok=false; try { throw 1; } catch { ok=true; } if(!ok) throw "no-binding";
print("ok");

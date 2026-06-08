// JSON.rawJSON / JSON.isRawJSON (json-parse-with-source proposal).
if (JSON.stringify(JSON.rawJSON(1)) !== "1") throw "raw number";
if (JSON.stringify(JSON.rawJSON(1.1e1)) !== "11") throw "raw exp";
if (JSON.stringify(JSON.rawJSON(null)) !== "null") throw "raw null";
if (JSON.stringify({a: JSON.rawJSON("123"), b: JSON.rawJSON('"x"')}) !== '{"a":123,"b":"x"}') throw "embedded";
if (!JSON.isRawJSON(JSON.rawJSON(1))) throw "isRawJSON true";
if (JSON.isRawJSON(1) || JSON.isRawJSON(null) || JSON.isRawJSON({}) || JSON.isRawJSON(undefined)) throw "isRawJSON false";
// returned object: null proto, frozen, only own prop "rawJSON"
var r = JSON.rawJSON(5);
if (Object.getPrototypeOf(r) !== null) throw "null proto";
if (Object.getOwnPropertyNames(r).join(",") !== "rawJSON") throw "own names";
if (Object.getOwnPropertySymbols(r).length !== 0) throw "no symbols";
if (r.rawJSON !== "5") throw "rawJSON value";
if (!Object.isFrozen(r)) throw "frozen";
// validation: empty / leading-trailing ws / non-JSON → SyntaxError; symbol → TypeError
["", " 1", "1 ", "\t1", "{", "1,2", "[object Object]"].forEach(function(s){
  var ok=false; try { JSON.rawJSON(s); } catch(e){ ok = e instanceof SyntaxError; }
  if (!ok) throw "should SyntaxError: "+JSON.stringify(s);
});
["{}", "[]"].forEach(function(v){ var ok=false; try { JSON.rawJSON(eval("("+v+")")); } catch(e){ ok = e instanceof SyntaxError; } if(!ok) throw "obj/arr "+v; });
var t=false; try { JSON.rawJSON(Symbol()); } catch(e){ t = e instanceof TypeError; } if(!t) throw "symbol TypeError";
if (JSON.rawJSON.length !== 1 || JSON.isRawJSON.length !== 1) throw "length";
print("ok");

// Proxy isExtensible trap result must equal the target's actual [[IsExtensible]].
var ext = {};                       // extensible target
var pLieFalse = new Proxy(ext, { isExtensible: function(){ return false; } });
var a=false; try { Object.isExtensible(pLieFalse); } catch(e){ a = e instanceof TypeError; }
if (!a) throw "lying false on extensible target must throw";
var ne = Object.preventExtensions({});   // non-extensible target
var pLieTrue = new Proxy(ne, { isExtensible: function(){ return true; } });
var b=false; try { Object.isExtensible(pLieTrue); } catch(e){ b = e instanceof TypeError; }
if (!b) throw "lying true on non-extensible target must throw";
// consistent traps return correctly
if (Object.isExtensible(new Proxy({}, { isExtensible: function(){ return true; } })) !== true) throw "consistent true";
if (Object.isExtensible(new Proxy(Object.preventExtensions({}), { isExtensible: function(){ return false; } })) !== false) throw "consistent false";
if (Reflect.isExtensible(new Proxy({}, {})) !== true) throw "absent trap forwards";
print("ok");

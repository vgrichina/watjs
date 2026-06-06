function p(n,v){print(n+"="+v);}
// indices (fully-default attrs so they stay plain data elements, not deopted)
var a=[1,2,3];
Object.defineProperties(a, {0:{value:99,writable:true,enumerable:true,configurable:true}, 4:{value:7,writable:true,enumerable:true,configurable:true}});
p("indices", JSON.stringify(a) + " len=" + a.length);
// length resize
Object.defineProperties(a, {length:{value:2}});
p("resize", JSON.stringify(a));
// shrinking past a NON-configurable index throws TypeError, length stops at idx+1
var nc=[1,2,3,4]; Object.defineProperty(nc,"2",{value:9,configurable:false});
var ncThrew=false; try { Object.defineProperty(nc,"length",{value:0}); } catch(e){ ncThrew=(e.constructor.name==="TypeError"); }
p("shrink-nc", ncThrew + " len=" + nc.length);
// invalid length → RangeError
var threw=false; try { Object.defineProperties([], {length:{value:-1}}); } catch(e){ threw=(e.constructor.name==="RangeError"); }
p("range-neg", threw);
var threw2=false; try { Object.defineProperties([], {length:{value:undefined}}); } catch(e){ threw2=(e.constructor.name==="RangeError"); }
p("range-undef", threw2);
// named prop on array
var a2=[]; Object.defineProperties(a2, {foo:{value:5,enumerable:true}});
p("named", a2.foo);
// single defineProperty still intact
var a3=[]; Object.defineProperty(a3,"length",{value:3});
p("single-length", a3.length);

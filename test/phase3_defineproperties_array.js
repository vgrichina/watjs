function p(n,v){print(n+"="+v);}
// indices
var a=[1,2,3];
Object.defineProperties(a, {0:{value:99}, 4:{value:7}});
p("indices", JSON.stringify(a) + " len=" + a.length);
// length resize
Object.defineProperties(a, {length:{value:2}});
p("resize", JSON.stringify(a));
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

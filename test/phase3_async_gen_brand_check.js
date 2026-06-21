// AsyncGeneratorPrototype next/return/throw on a bad `this` → REJECTED promise (not sync throw)
async function* ag(){ yield 1; }
var AGP = Object.getPrototypeOf(ag());  // %AsyncGeneratorPrototype% (carries next/return/throw)
var results = [];
function check(label, p){
  return p.then(function(){ results.push(label+":resolved-FAIL"); },
                function(e){ results.push(label+":"+(e instanceof TypeError)); });
}
// length is 1
if (AGP.next.length !== 1 || AGP.return.length !== 1 || AGP.throw.length !== 1) throw "length";

Promise.all([
  check("next-undef", AGP.next.call(undefined)),
  check("next-num", AGP.next.call(1)),
  check("next-plain", AGP.next.call({})),
  check("return-null", AGP.return.call(null)),
  check("throw-str", AGP.throw.call("x")),
  // valid async gen still works
  ag().next().then(function(r){ results.push("valid:"+r.value+","+r.done); })
]).then(function(){
  var expect = "next-undef:true,next-num:true,next-plain:true,return-null:true,throw-str:true,valid:1,false";
  // order within Promise.all preserved
  if (results.join(",") !== expect) throw "got:"+results.join(",");
  print("ok");
});

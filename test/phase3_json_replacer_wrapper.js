// JSON.stringify replacer array: a String/Number wrapper element is coerced via
// ToString(object) (invoking its toString), not its internal primitive value.
var num = new Number(10);
num.toString = function(){ return 'NN'; };
num.valueOf = function(){ throw new Error('valueOf should not be called'); };
if (JSON.stringify({ NN: 1, "10": 2 }, [num]) !== '{"NN":1}') throw "number wrapper";
var str = new String('s');
str.toString = function(){ return 'SS'; };
if (JSON.stringify({ SS: 1, s: 2 }, [str]) !== '{"SS":1}') throw "string wrapper";
// plain string/number replacer keys still work
if (JSON.stringify({a:1,b:2,c:3}, ["a","c"]) !== '{"a":1,"c":3}') throw "plain keys";
if (JSON.stringify({0:1,1:2}, [0]) !== '{"0":1}') throw "number key";
// Boolean wrapper (and other objects) are ignored
if (JSON.stringify({"true":1}, [new Boolean(true)]) !== '{}') throw "boolean ignored";
// dedup
if (JSON.stringify({a:1}, ["a","a"]) !== '{"a":1}') throw "dedup";
print("ok");

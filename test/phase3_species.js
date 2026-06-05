// Map/Set [Symbol.species] accessor returns the constructor (this)
print(Map[Symbol.species] === Map);
print(Set[Symbol.species] === Set);
var d = Object.getOwnPropertyDescriptor(Map, Symbol.species);
print(typeof d.get);
print(d.set);
print(d.enumerable);
print(d.configurable);
print(d.writable);
// subclass receiver: getter returns the receiver
function Sub(){}
print(Map[Symbol.species].name);

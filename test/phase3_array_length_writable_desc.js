// getOwnPropertyDescriptor must report the array length's ACTUAL writability
// (defineProperty / Object.freeze can make it non-writable), not a hardcoded true.
var a = [1,2,3];
if (Object.getOwnPropertyDescriptor(a,'length').writable !== true) throw "default writable";
Object.defineProperty(a, 'length', {writable: false});
if (Object.getOwnPropertyDescriptor(a,'length').writable !== false) throw "after defineProperty";
// behavior matches the descriptor: assignment refused, push throws
a.length = 9; if (a.length !== 3) throw "assign refused";
var threw = false; try { a.push(4); } catch(e){ threw = e instanceof TypeError; }
if (!threw) throw "push on non-writable length must throw";
// frozen array length is non-writable; sealed keeps writable
if (Object.getOwnPropertyDescriptor(Object.freeze([1]),'length').writable !== false) throw "frozen";
if (Object.getOwnPropertyDescriptor(Object.seal([1]),'length').writable !== true) throw "sealed";
print("ok");

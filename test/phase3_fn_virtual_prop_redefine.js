// A function's length/name are configurable; a partial defineProperty preserves
// configurable, so repeated redefinition works (and getOwnPropertyDescriptor agrees).
function f(a, b){}
if (Object.getOwnPropertyDescriptor(f,'length').configurable !== true) throw "length C";
Object.defineProperty(f, 'length', {value: 1});
if (f.length !== 1) throw "len 1";
if (Object.getOwnPropertyDescriptor(f,'length').configurable !== true) throw "length C preserved";
Object.defineProperty(f, 'length', {value: 2});  // must not throw
if (f.length !== 2) throw "len 2";
// name likewise
Object.defineProperty(f, 'name', {value: 'a'});
Object.defineProperty(f, 'name', {value: 'b'});
if (f.name !== 'b') throw "name b";
// explicitly non-configurable then redefine fails
function g(){}
Object.defineProperty(g, 'length', {value: 9, configurable: false});
var threw = false;
try { Object.defineProperty(g, 'length', {value: 10}); } catch(e){ threw = e instanceof TypeError; }
if (!threw) throw "explicit non-configurable redefine must throw";
print("ok");

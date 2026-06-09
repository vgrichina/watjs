// delete of a non-reference (literal, new-expr, unary expr) → true
assert(delete 1 === true, "delete literal");
assert(delete new Object() === true, "delete new-expression");
assert(delete this === true, "delete this");
assert(delete void 0 === true, "delete void expr");
var a = { b: 1 };
assert(delete void a.b === true, "delete void member");
assert(delete typeof a === true, "delete typeof");

// delete of a non-configurable global → false; configurable → true
assert(delete NaN === false, "delete NaN (non-configurable global)");
assert(delete Infinity === false, "delete Infinity");
assert(delete undefined === false, "delete undefined");
implicitGlobal = 5;
assert(delete implicitGlobal === true, "delete implicit global (configurable)");
assert(delete unresolvableName === true, "delete unresolvable → true");

// delete member: configurable → removed+true; non-configurable → false
var o = { x: 1 };
assert(delete o.x === true && !('x' in o), "delete configurable own prop");
Object.defineProperty(o, 'y', { value: 2, configurable: false });
assert(delete o.y === false && ('y' in o), "delete non-configurable own prop → false");

// delete on a null/undefined base → TypeError (ToObject throws)
var nthrew = 0;
try { delete null.x; } catch (e) { if (e instanceof TypeError) nthrew++; }
try { delete undefined.y; } catch (e) { if (e instanceof TypeError) nthrew++; }
try { delete null[0]; } catch (e) { if (e instanceof TypeError) nthrew++; }
assert(nthrew === 3, "delete on null/undefined base throws TypeError");

/*---
description: basic assert.sameValue / assert.throws usage
---*/
assert.sameValue(1 + 1, 2, "addition");
assert.sameValue("a" + "b", "ab");
assert.sameValue(typeof 1, "number");
assert(true);
function Custom(m){ this.message = m; }
assert.throws(Custom, function(){ throw new Custom("x"); });

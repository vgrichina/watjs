// includes/startsWith/endsWith throw TypeError on a RegExp search argument
function thr(fn){try{fn();return false;}catch(e){return e instanceof TypeError;}}
print(thr(function(){ "abc".startsWith(/a/); }));
print(thr(function(){ "abc".endsWith(/c/); }));
print(thr(function(){ "abc".includes(/b/); }));
// strings still work
print("abc".startsWith("ab"));
print("abc".endsWith("bc"));
print("abc".includes("b"));
// a non-regexp object is fine (coerced to string)
print("a[object Object]b".includes({}));

// replaceAll with a RegExp whose @@replace is overridden to undefined must fall
// through to the STRING algorithm (ToString(regex)), not regex-replace every char.
var re = /./g;
Object.defineProperty(re, Symbol.replace, { value: undefined });
var r = '--- /./g --- /a/g --- /./g ---'.replaceAll(re, 'X');
if (r !== '--- X --- /a/g --- X ---') throw "override: "+r;
// normal regex replaceAll still works
if ("a1b2c3".replaceAll(/[0-9]/g,"_") !== "a_b_c_") throw "regex";
if ("aXbXc".replaceAll("X","-") !== "a-b-c") throw "string";
print("ok");

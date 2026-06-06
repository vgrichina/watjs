// \k<name> named backreferences.
function p(n, v) { print(n + "=" + v); }
p("dup", /(?<c>\w)\k<c>/.test("aa"));            // true
p("dup-no", /(?<c>\w)\k<c>/.test("ab"));         // false
p("word", "hi hi".match(/(?<w>\w+) \k<w>/)[0]);  // hi hi
p("numbered-still", /(\w)\1/.test("zz"));        // true
p("groups-still", "x".match(/(?<g>x)/).groups.g); // x

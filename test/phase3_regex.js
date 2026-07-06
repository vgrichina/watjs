assert(RegExp("\\d+").test("abc123"), "digits");
assert(!RegExp("\\d+").test("abcdef"), "no digits");
assert(RegExp("^hello$").test("hello"), "anchors");
assert(!RegExp("^hello$").test("hello world"), "anchors fail");
assert(RegExp("colou?r").test("color"), "optional");
assert(RegExp("colou?r").test("colour"), "optional 2");
assert(RegExp("a{2,3}").test("aaa"), "brace quant");
assert(RegExp("[a-z]+@[a-z]+\\.[a-z]+").test("me@host.com"), "email-ish");
assert(RegExp("[^0-9]+").test("abc"), "negated class");
assert("hello123world".match("[0-9]+")[0] === "123", "match");
assert("foo bar baz".search("bar") === 4, "search");
// String.prototype.replace with a STRING searchValue searches literally (not as a regex),
// replacing only the first occurrence — a RegExp searchValue is needed for pattern matching.
assert("a1b2".replace("1", "#") === "a#b2", "replace first (literal)");
assert("a1b2".replace("[0-9]", "#") === "a1b2", "replace literal not regex");
assert("x.y.z".replace(".", "-") === "x-y.z", "replace literal dot first");
assert("a1b2".replace(/[0-9]/, "#") === "a#b2", "replace regexp first");
print("regex tests passed");

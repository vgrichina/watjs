// GetSubstitution: a two-digit $nn capture reference (e.g. $01) — including
// zero-padded ones — takes precedence; $0 alone and $nn>m stay literal.
if (/b(c)(z)?(.)/[Symbol.replace]('abcde','[$01$02$03]') !== 'a[cd]e') throw "01-03";
if (/b(c)(z)?(.)/[Symbol.replace]('abcde','[$01$02$03$04$00]') !== 'a[cd$04$00]e') throw "04-00";
if ("abcde".replace(/(c)(d)/,"[$01$02]") !== "ab[cd]e") throw "2cap";
if ("XY".replace(/(X)(Y)/,"$2$1") !== "YX") throw "single-digit";  // unchanged
if ("XY".replace(/(X)/,"$0") !== "$0Y") throw "$0 literal";
if ("aXb".replace(/X/,"$1") !== "a$1b") throw "$1 no-group literal";
print("ok");

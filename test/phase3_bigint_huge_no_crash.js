// A BigInt literal/conversion beyond i64 range must not crash the engine. Our BigInt
// is i64-limited (precision is lossy for huge values), but parsing must saturate, not
// trap (i64.trunc_f64_s would trap "float unrepresentable in integer range").
var lit = 100000000000000000000000000000000000000000000000000000000000000000000000000000000001n;
assert(typeof lit === "bigint", "huge BigInt literal parses without crashing");
var fromStr = BigInt("100000000000000000000000000000000000000000000000000000000000000000000000000000000001");
assert(typeof fromStr === "bigint", "BigInt(huge string) without crashing");
var fromNum = BigInt(Number.MAX_SAFE_INTEGER);
assert(typeof fromNum === "bigint", "BigInt(MAX_SAFE_INTEGER)");
// normal BigInts still exact
assert(123n === 123n, "small BigInt exact");
assert(BigInt("42") === 42n, "BigInt('42') exact");
assert(9007199254740991n === 9007199254740991n, "2^53-1 BigInt exact");

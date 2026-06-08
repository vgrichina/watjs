// Static initialization blocks run at class definition with this = the constructor,
// in textual order interleaved with static fields.
class B { static { this.z = 7; } }
if (B.z !== 7) throw new Error("static block sets via this");
var log = [];
class C { static a = log.push("f1"); static { log.push("block"); } static b = log.push("f2"); }
if (log.join() !== "f1,block,f2") throw new Error("textual order: " + log.join());
// multiple blocks
class D { static { this.x = 1; } static { this.x += 10; } }
if (D.x !== 11) throw new Error("multiple blocks");
// block can reference static fields already initialized
class E { static base = 5; static { this.derived = this.base * 2; } }
if (E.derived !== 10) throw new Error("block reads prior static field");
// computed static fields still work (regression guard for the i32.and trap)
class F { static [1.1] = 2; }
if (F[1.1] !== 2) throw new Error("computed static field");
print("ok");

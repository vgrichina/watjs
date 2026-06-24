// Promise.prototype.then consults SpeciesConstructor for its result promise.
function thr(C, f){ try { f(); return false; } catch(e){ return e instanceof C; } }

// custom species constructor (a plain constructor, not a Promise subclass) is used,
// and the instance's `constructor` is accessed exactly once.
var p1 = new Promise(function(){});
function Species(executor){ executor(function(){}, function(){}); }
Species.prototype = Object.create(Promise.prototype);
var callCount = 0;
function Ctor(){}
Object.defineProperty(p1, "constructor", { get: function(){ callCount++; return Ctor; } });
Ctor[Symbol.species] = Species;
var p2 = p1.then();
if (!(p2 instanceof Species)) throw "result not a Species instance";
if (callCount !== 1) throw "constructor accessed " + callCount + " times";

// null constructor → TypeError
var pn = new Promise(function(){}); pn.constructor = null;
if (!thr(TypeError, function(){ pn.then(); })) throw "null-ctor not TypeError";

// throwing @@species getter propagates
var pt = new Promise(function(){}); function C2(){}
Object.defineProperty(C2, Symbol.species, { get: function(){ throw new RangeError("boom"); } });
pt.constructor = C2;
if (!thr(RangeError, function(){ pt.then(); })) throw "species-throw not propagated";

// non-constructor species → TypeError
var pnc = new Promise(function(){}); function C3(){} C3[Symbol.species] = 42; pnc.constructor = C3;
if (!thr(TypeError, function(){ pnc.then(); })) throw "non-ctor species not TypeError";

// default %Promise% path still chains correctly
Promise.resolve(10).then(function(v){ return v + 1; }).then(function(v){
  if (v !== 11) throw "chain value " + v;
  print("ok");
});

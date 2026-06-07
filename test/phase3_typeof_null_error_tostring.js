print(typeof null);
var x = null; print(typeof x);
print(Error.prototype.toString.call({}));
print(Error.prototype.toString.call({message:'42'}));
print(Error.prototype.toString.call({name:'24'}));
print(Error.prototype.toString.call({name:'24',message:'42'}));
function tc(f){ try{ f(); return "no-throw"; }catch(e){ return e.constructor.name; } }
print(tc(function(){ Error.prototype.toString.call(null); }));
print(tc(function(){ Error.prototype.toString.call(1); }));
print(tc(function(){ Error.prototype.toString.call(Symbol()); }));
print(new TypeError("boom").toString());

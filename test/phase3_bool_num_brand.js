print(true.toString());
print(new Boolean(false).valueOf());
print(new Number(7).valueOf());
function tc(f){ try{ f(); return "no-throw"; }catch(e){ return e.constructor.name; } }
print(tc(function(){ var s=new String(); s.x=Boolean.prototype.valueOf; s.x(); }));
print(tc(function(){ var n=new Number(); n.x=Boolean.prototype.valueOf; n.x(); }));
print(tc(function(){ var s=new String(); s.x=Boolean.prototype.toString; s.x(); }));
print(tc(function(){ var s=new String(); s.x=Number.prototype.valueOf; s.x(); }));
print(tc(function(){ var b=new Boolean(); b.x=Number.prototype.valueOf; b.x(); }));

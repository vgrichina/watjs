function tc(f){ try{ f(); return "no-throw"; }catch(e){ return e.constructor.name; } }
print(tc(function(){ (0).toFixed(0n); }));
print(tc(function(){ (0).toExponential(0n); }));
print(tc(function(){ (255).toString(2n); }));
print(tc(function(){ (1.5).toPrecision(3n); }));
print((123.456).toFixed(2));
print((255).toString(16));

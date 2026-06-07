function tc(f){try{f();return"no";}catch(e){return e.constructor.name;}}
print(JSON.stringify(/l/.exec("hello")));
print(JSON.stringify(/(\d)/.exec("a5")));
print(tc(function(){var o={};o.exec=RegExp.prototype.exec;o.exec("hi");}));
print(tc(function(){RegExp.prototype.exec.call(5,"hi");}));
print(tc(function(){RegExp.prototype.exec.call({},"hi");}));

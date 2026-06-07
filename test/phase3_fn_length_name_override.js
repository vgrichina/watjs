function f(a,b,c){}
print(f.length);
print(f.name);
Object.defineProperty(f,"length",{value:5.7,configurable:true});
print(f.bind({}).length);
var h=function(){};
Object.defineProperty(h,"name",{value:42,configurable:true});
print(JSON.stringify(h.bind({}).name));
print(parseInt.length);
print([].map.length);

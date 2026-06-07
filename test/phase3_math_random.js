print(typeof Math.random);
print(Math.random.name);
print(Math.random.length);
var ok=true;
for(var i=0;i<500;i++){ var r=Math.random(); if(r<0||r>=1||typeof r!=='number') ok=false; }
print(ok);

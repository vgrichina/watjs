print(/abc/gi.toString());
print(/x/.toString());
print(new RegExp("a","g").toString());
print(String(/abc/g));
print(RegExp.prototype.toString.call({source:"x",flags:"g"}));

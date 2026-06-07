var d=new Date(Date.UTC(2020,5,15,10,30,45,123));
print(d.getUTCDay());
print(d.getUTCMinutes());
print(d.getUTCSeconds());
print(d.getUTCMilliseconds());
print(typeof Date.prototype.getUTCSeconds);
print(d.getUTCMinutes()===d.getMinutes());

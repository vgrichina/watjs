var o = { *g() { yield 1; yield 2; }, *[("h")]() { yield 9; } };
print("obj-gen=" + JSON.stringify([...o.g()]));
print("obj-computed-gen=" + JSON.stringify([...o.h()]));
print("name=" + o.g.name);

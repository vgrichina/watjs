function p(n,v){print(n+"="+v);}
p("apply-enum", Object.getOwnPropertyDescriptor(Reflect, "apply").enumerable);
p("get-enum", Object.getOwnPropertyDescriptor(Reflect, "get").enumerable);
p("defineProperty-enum", Object.getOwnPropertyDescriptor(Reflect, "defineProperty").enumerable);
p("keys-empty", JSON.stringify(Object.keys(Reflect)));
p("has-method", typeof Reflect.has);

function p(n,v){print(n+"="+v);}
p("Object.keys", Object.keys.length);
p("Object.values", Object.values.length);
p("Object.entries", Object.entries.length);
p("Object.assign", Object.assign.length);
p("Object.create", Object.create.length);
p("Object.freeze", Object.freeze.length);
p("Object.is", Object.is.length);
p("Object.getPrototypeOf", Object.getPrototypeOf.length);
p("Object.setPrototypeOf", Object.setPrototypeOf.length);
p("Object.defineProperty", Object.defineProperty.length);
p("Object.defineProperties", Object.defineProperties.length);
p("Object.getOwnPropertyNames", Object.getOwnPropertyNames.length);
p("Object.preventExtensions", Object.preventExtensions.length);
p("Object.seal", Object.seal.length);
p("length-desc", JSON.stringify(Object.getOwnPropertyDescriptor(Object.keys, "length")));

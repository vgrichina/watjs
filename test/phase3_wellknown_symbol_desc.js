function p(n,v){print(n+"="+v);}
function attrs(o,k){ var d=Object.getOwnPropertyDescriptor(o,k); return d.writable+","+d.enumerable+","+d.configurable; }
p("iterator", attrs(Symbol, "iterator"));         // false,false,false
p("toPrimitive", attrs(Symbol, "toPrimitive"));   // false,false,false
p("hasInstance", attrs(Symbol, "hasInstance"));   // false,false,false
p("for", attrs(Symbol, "for"));                   // true,false,true
p("keyFor", attrs(Symbol, "keyFor"));             // true,false,true
p("iterator-is-symbol", typeof Symbol.iterator);  // symbol
p("array-iterable", typeof [1,2][Symbol.iterator]); // function
p("symbol-keys-empty", JSON.stringify(Object.keys(Symbol))); // []

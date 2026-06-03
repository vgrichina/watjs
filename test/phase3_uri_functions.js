function p(n,v){print(n+"="+v);}
p("euc", encodeURIComponent("a b&c=d/e"));    // a%20b%26c%3Dd%2Fe
p("eu", encodeURI("a b/c?d=e"));               // a%20b/c?d=e
p("duc", decodeURIComponent("a%20b%26c"));     // a b&c
p("du", decodeURI("a%20b%2Fc"));               // a b%2Fc (reserved kept)
p("roundtrip", decodeURIComponent(encodeURIComponent("héllo +!")));  // héllo +!
p("unreserved", encodeURIComponent("-_.!~*'()"));  // unchanged
p("len", encodeURIComponent.length + "," + decodeURI.length);  // 1,1
p("type", typeof encodeURI + "," + typeof decodeURIComponent);
var threw=false; try { decodeURIComponent("%E0%A4%A"); } catch(e){ threw = e.constructor.name==="URIError"; }
p("malformed", threw);

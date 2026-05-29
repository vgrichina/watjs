function classify(n) {
  switch (n) {
    case 1: return "one";
    case 2: return "two";
    case 3: return "three";
    default: return "many";
  }
}
print(classify(1));
print(classify(2));
print(classify(3));
print(classify(9));
function fall(n) {
  var r = "";
  switch (n) {
    case 1: r += "a";
    case 2: r += "b";
    case 3: r += "c"; break;
    case 4: r += "d";
  }
  return r;
}
print(fall(1));
print(fall(2));
print(fall(3));
print(fall(4));
var x = "hi";
switch (x) {
  case "lo": print("LO"); break;
  case "hi": print("HI"); break;
  default: print("DEF");
}

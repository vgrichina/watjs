print("io=" + [1,2,1,2].indexOf(2,2));        // 3
print("io-neg=" + [1,2,3,1].indexOf(1,-2));   // 3
print("io-miss=" + [1,2,3].indexOf(1,1));     // -1
print("li=" + [1,2,1,2].lastIndexOf(2,2));    // 1
print("li-neg=" + [2,1,2,1].lastIndexOf(2,-2)); // 2
print("li-plain=" + [2,1,2,1].lastIndexOf(2)); // 2
print("inc=" + [1,2,3].includes(1,1));        // false

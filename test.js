var natural = require("natural");

function check(message) {
  const names = ["covid19", "coronavirus", "cars", "ccpvirus"];
  for (var i = 0; i < names.length; i++) {
    console.log(
      `${natural.JaroWinklerDistance(names[i], message)} for ${
        names[i]
      } and ${message}`
    );
  }
  return false;
}

check("ccp-virus");

var natural = require("natural");
const request = require("request");
const { flag, code, name, countries } = require("country-emoji");

function check(message) {
  const names = ["covid19", "coronavirus", "cars", "ccpvirus"];
  for (var i = 0; i < names.length; i++) {
    if (natural.JaroWinklerDistance(names[i], message) > 0.95) return true;
  }
  return false;
}

function getWorldStats() {
  return new Promise(function (resolve, reject) {
    request("https://api.thevirustracker.com/free-api?global=stats", function (
      error,
      response,
      body
    ) {
      if (response.statusCode === 200 && JSON.parse(body).results !== undefined)
        resolve(JSON.parse(body).results[0]);
      else return error;
    });
  });
}

function getCountryStats(country) {
  const countryCode = code(country);
  return new Promise(function (resolve, reject) {
    request(
      `https://api.thevirustracker.com/free-api?countryTotal=${countryCode}`,
      function (error, response, body) {
        if (
          response.statusCode === 200 &&
          JSON.parse(body).countrydata !== undefined
        ) {
          resolve(JSON.parse(body).countrydata[0]);
        } else resolve(JSON.parse(error));
      }
    );
  });
}

function getTopFive() {}

module.exports = {
  check: check,
  worldStats: getWorldStats,
  country: getCountryStats,
  topFive: getTopFive,
};

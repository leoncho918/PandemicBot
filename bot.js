var Discord = require("discord.io");
var logger = require("winston");
var auth = require("./auth.json");
var coronavirus = require("./coronavirus");
const { flag, code, name, countries } = require("country-emoji");
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = "debug";
// Initialize Discord Bot
var bot = new Discord.Client({
  token: auth.token,
  autorun: true,
});

bot.on("ready", function (evt) {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(bot.username + " - (" + bot.id + ")");
});

bot.on("message", function (user, userID, channelID, message, evt) {
  let args = [];
  if (message.includes(" ")) {
    args.push(message.substr(0, message.indexOf(" ")));
    args.push(message.substr(message.indexOf(" ") + 1));
  } else {
    args.push(message);
  }
  var disease = args[0];
  if (coronavirus.check(disease) && userID !== 700757832848375872) {
    if (args.length === 1) {
      coronavirus
        .worldStats()
        .then((res) => {
          const keys = Object.keys(res);
          let message = "";
          message = message + "__**COVID-19 Statistics Worldwide 🌏**__\n";
          for (let i = 0; i < keys.length - 1; i++) {
            message =
              message +
              `**${capitaliseString(
                keys[i].replace(new RegExp("_", "g"), " ")
              )}:** ${parseNumber(res[keys[i]])}\n`;
          }
          sendMessage(channelID, message);
        })
        .catch((e) => {
          console.log("Error: " + e);
        });
    } else if (args.length === 2 && typeof args[1] === "string") {
      coronavirus.country(args[1]).then((res) => {
        if (res === null) {
          sendMessage(
            channelID,
            `I cannot find a country called "${args[1]}", please use another country name.`
          );
        } else {
          const keys = Object.keys(res);

          let message = "";
          message =
            message +
            `__**COVID-19 Statistics for ${
              res.info.title === "Korea" ? "North Korea" : res.info.title
            } ${flag(
              res.info.title === "Korea" ? "North Korea" : res.info.title
            )}**__\n`;
          for (let i = 1; i < keys.length; i++) {
            message =
              message +
              `**${capitaliseString(
                keys[i].replace(new RegExp("_", "g"), " ")
              )}:** ${parseNumber(res[keys[i]])}\n`;
          }
          if (unreliableCountry(res.info.title)) {
            message =
              message + "*This country's statistics may not be accurate.*";
          }
          sendMessage(channelID, message);
        }
      });
    }
  }
});

function unreliableCountry(country) {
  let unreliable = ["china", "russia", "vietnam", "iran", "north korea"];
  return unreliable.includes(country.toLowerCase());
}

function capitaliseString(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
}

function parseNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function sendMessage(channelID, message) {
  bot.sendMessage({
    to: channelID,
    message: message,
  });
}

const Discord = require("discord.js");
const { token } = require("./config.json");
const { wlt } = require("./WLT.json");
var fs = require("fs");
const bot = new Discord.Client();

const imagePath = "C:\\Users\\camer\\Desktop\\sorted\\";

bot.on("ready", () => {
  console.log("WONNLETON HAS RISEN");
});

bot.on("message", msg => {
  if (msg.content === "cringe") {
    msg.reply("crinje*");
  } else if (msg.content === "wlt") {
    msg.reply(wlt[randomIndex(wlt.length)]);
  } else if (msg.content.startsWith("!linda ")) {
    try {
      var linda = msg.content.split(" ")[1];
      var files = fs.readdirSync(imagePath + linda);
      var randomLinda = files[randomIndex(files.length)];

      msg.reply("", {
        files: [imagePath + linda + "\\" + randomLinda]
      });
    } catch {
      msg.reply("that aint the raw");
    }
  } else if (msg.content.startsWith("wlt ")) {
    var wltNum = msg.content.split(" ")[1];
    if (wltNum <= 0 || wltNum > wlt.length) {
      msg.reply("Please enter a valid WLT.");
    } else {
      msg.reply(wlt[wltNum - 1]);
    }
  }
  if (msg.content.includes("cheers")) {
    msg.channel.send("Aye. Cheers.");
  }
});

function randomIndex(length) {
  return Math.floor(Math.random() * length);
}

bot.login(token);

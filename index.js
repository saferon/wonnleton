// ideas: add translate function, integrate with l.i.n.d.a, fetch youtube uploads from mike, mark, trevor, and sonny

const Discord = require("discord.js");
const { token } = require("./config.json");
const { wlt } = require("./WLT.json");
const { help } = require("./helplist.json");
var fs = require("fs");
const bot = new Discord.Client();
const imagePath = "C:\\Users\\camer\\Desktop\\sorted\\";
var lindaList = fs.readdirSync(imagePath);
var lindaArray = listSort(lindaList);

bot.on("ready", () => {
  console.log("WONNLETON HAS RISEN");
  // console.log(lindaList);
  // console.log(listSort(lindaList));
});

bot.on("message", msg => {
  if (msg.content.startsWith("!linda ")) {
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
  if (msg.content.includes("spicy")) {
    msg.channel.send("ไม่เผ็ดไม่กิน");
  }
  //   if (msg.content === "!lindas") {
  //     var lindaList = fs.readdirSync(imagePath);
  //     var index = lindaList.indexOf("desktop.ini");
  //     lindaList.splice(index, 1);
  //     var lindaArray = listSort(lindaList);
  //     // msg.author.send("```" + lindaArray + "```");
  //     // msg.author.send(lindaArray);
  //     for (var i = 0; i < lindaArray.length; i++) {
  //       msg.author.send("```" + lindaArray[i] + "```");
  //     }
  //   }
  //   if (msg.content === "!randomlinda") {
  //     var lindaList = fs.readdirSync(imagePath);
  //     var randomFolder = randomIndex(lindaList.length);
  //     var chosenFolder = fs.readdirSync(imagePath + lindaList[randomFolder]);
  //     var lindaFolder = randomIndex(chosenFolder.length);
  //     msg.channel.send(lindaList[randomFolder] + "!", {
  //       files: [
  //         imagePath + lindaList[randomFolder] + "\\" + chosenFolder[lindaFolder]
  //       ]
  //     });
  //   }
  //   if (msg.content === "!help") {
  //     msg.author.send(help);
  //   }
});

bot.on("message", msg => {
  switch (msg.content) {
    case "cringe":
      msg.reply("crinje*");
      break;

    case "wlt":
      msg.reply(wlt[randomIndex(wlt.length)]);
      break;

    case "!randomlinda":
      var lindaList = fs.readdirSync(imagePath);
      var randomFolder = randomIndex(lindaList.length);
      var chosenFolder = fs.readdirSync(imagePath + lindaList[randomFolder]);
      var lindaFolder = randomIndex(chosenFolder.length);
      msg.channel.send(lindaList[randomFolder] + "!", {
        files: [
          imagePath + lindaList[randomFolder] + "\\" + chosenFolder[lindaFolder]
        ]
      });
      break;

    case "!lindas":
      var lindaList = fs.readdirSync(imagePath);
      var index = lindaList.indexOf("desktop.ini");
      lindaList.splice(index, 1);
      var lindaArray = listSort(lindaList);
      for (var i = 0; i < lindaArray.length; i++) {
        msg.author.send("```" + lindaArray[i] + "```");
      }
      break;

    case "!help":
      msg.author.send(help);
      break;
    // HOW DO WE MAKE THIS WORK???
    // case startsWith("!linda "):
    //   try {
    //     var linda = msg.content.split(" ")[1];
    //     var files = fs.readdirSync(imagePath + linda);
    //     var randomLinda = files[randomIndex(files.length)];
    //     msg.reply("", {
    //       files: [imagePath + linda + "\\" + randomLinda]
    //     });
    //   } catch {
    //     msg.reply("that aint the raw");
    //   }
    //   break;

    // case startsWith("wlt "):
    //   var wltNum = msg.content.split(" ")[1];
    //   if (wltNum <= 0 || wltNum > wlt.length) {
    //     msg.reply("Please enter a valid WLT.");
    //   } else {
    //     msg.reply(wlt[wltNum - 1]);
    //   }
    //   break;

    // case includes("cheers"):
    //   msg.channel.send("Aye, cheers.");
    //   break;

    // case includes("spicy"):
    //   msg.channel.send("ไม่เผ็ดไม่กิน");
    //   break;

    // default:
    //   break;
  }
});

function randomIndex(length) {
  return Math.floor(Math.random() * length);
}

function listSort(list) {
  let tmpArr = [];
  for (var i = 0; i < list.length / 10; i++) {
    tmpArr.push(list.slice(i * 10, 10 + i * 10));
  }
  for (var i = 0; i < tmpArr.length; i++) {
    for (var j = 0; j < tmpArr[i].length; j++) {
      if (j === 0) {
        continue;
      }
      tmpArr[i][j] = " " + tmpArr[i][j];
    }
  }
  return tmpArr;
}

bot.login(token);

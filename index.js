// ideas: integrate with l.i.n.d.a, fetch youtube uploads from mike, mark, trevor, and sonny
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

const Discord = require("discord.js");
const { token } = require("./config.json");
const { wlt } = require("./WLT.json");
const { help } = require("./helplist.json");
var fs = require("fs");
var ffmpeg = require("ffmpeg");
const bot = new Discord.Client();
const imagePath = "/media/pi/8A02-DF82/lindas/";
const songPath = "/media/pi/8A02-DF82/songs/";
const ytdl = require("ytdl-core")
// cooldowns
let cooldown = new Set();
let cdFiveSec = 5;
let dayCooldown = new Set();
let cdDay = 3600 // an hour   86400; // a day

let xp = require("./xp.json");
let AP = require("./AP.json");

let APCoinEmoji = "627897331068436481";

var queued = {};

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

bot.on("ready", () => {
  console.log("WONNLETON HAS RISEN");
});

//////////////////////////////////////////////////////////////////////////////////
//functions //////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

bot.on('message', async msg => {
  //set-up prefix and command part to take in, args for after the command
  var prefix = '!'
  var command = msg.content.toLowerCase().slice(prefix.length).split(' ')[0];
  var args = msg.content.split(' ').slice(1);
  //skips anything a bot sends
  if (msg.author.bot) return;

//////////////////////////////////////////////////////////////////////////////////
//xp system///////////////////////////////////////////////////////////////////////

  let xpAdd = Math.floor(Math.random() * 7) + 8;
  if(!xp[msg.author.id]){
    xp[msg.author.id] = {
      xp: 0,
      level: 1
    };
  };

  let currentXP = xp[msg.author.id].xp;
  let currentLevel = xp[msg.author.id].level;
  let nextLevel = xp[msg.author.id].level * 300;
  let untilNextLevel = nextLevel - currentXP
  xp[msg.author.id].xp = currentXP + xpAdd;
  if (nextLevel <= xp[msg.author.id].xp) {
    xp[msg.author.id].level = currentLevel + 1;
    let levelUp = new Discord.RichEmbed()
    .setTitle("Level Up!")
    .addField("New Level", currentLevel + 1)
    .setFooter(`${untilNextLevel} XP until level up`, msg.author.displayAvatarURL);

    msg.channel.send(levelUp)
  };

  fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
    if (err) console.log(err)
  });

//////////////////////////////////////////////////////////////////////////////////
//AP coins////////////////////////////////////////////////////////////////////////

  let apAdd = Math.floor(Math.random() * 3) + 3;
  if (!AP[msg.author.id]) {
    AP[msg.author.id] = {
      AP: 0
    };
  };

  let currentAP = AP[msg.author.id].AP;
  AP[msg.author.id].AP = currentAP + apAdd;

  if (AP[msg.author.id].AP < 0) {
    AP[msg.author.id].AP = 0
    msg.reply("You have run out of AP coin, you now have " + AP[msg.author.id].AP + " AP coin.")
  };

  fs.writeFile("./AP.json", JSON.stringify(AP), (err) => {
    if (err) console.log(err)
  });

//////////////////////////////////////////////////////////////////////////////////
//message includes content stuff//////////////////////////////////////////////////

  if (msg.content.includes("cheers")) {
    msg.channel.send("Aye. Cheers.");
  };

  if (msg.content.includes("spicy")) {
    msg.react("🌶️")
    msg.channel.send("ไม่เผ็ดไม่กิน");
  };

  if (msg.content.includes("cringe")) {
    msg.react("😬")
    msg.reply("crinje*")
  };

  if (msg.content.includes("AP")) {
    msg.react(APCoinEmoji)
  };

//////////////////////////////////////////////////////////////////////////////////
//all content after here needs to be executed with prefix/////////////////////////

  if (!msg.content.startsWith(prefix)) return;
  if (cooldown.has(msg.author.id)) {
    msg.delete();
    return msg.reply("Relax bro...")
  }

  cooldown.add(msg.author.id);

  setTimeout(() => {
    cooldown.delete(msg.author.id);
  }, cdFiveSec * 1000)
  
//////////////////////////////////////////////////////////////////////////////////
//profile thing///////////////////////////////////////////////////////////////////

  if (command === 'profile') {
    let levelEmbed = new Discord.RichEmbed()
    .setAuthor(msg.author.username)
    .addField("Level", currentLevel, true)
    .addField("XP", currentXP, true)
    .addField("AP Coin", currentAP, true)
    .setFooter(`${untilNextLevel} XP until level up`, msg.author.displayAvatarURL);

    msg.channel.send(levelEmbed)

  };

//////////////////////////////////////////////////////////////////////////////////
//Linda Stuff/////////////////////////////////////////////////////////////////////

  if (command === 'linda') {
      if (args.length === 0) {
        msg.reply("That ain't the raw... add some content.")
      } else {
        try {
          var files = fs.readdirSync(imagePath + args[0]);
          var randomLinda = files[randomIndex(files.length)];
          console.log("------------------------------") // 30 -
          console.log("requested a rare " + args[0])
          console.log(randomLinda);
          msg.reply("", {
            files: [imagePath + args[0] + "/" + randomLinda]
          });
        } catch {
          msg.reply("That ain't the raw... no content.")
        }
      }
  };


  if (command === 'randomlinda') {
    var lindaList = fs.readdirSync(imagePath);
    var index = lindaList.indexOf("desktop.ini");
    lindaList.splice(index, 1);
    var randomFolder = randomIndex(lindaList.length);
    var chosenFolder = fs.readdirSync(imagePath + lindaList[randomFolder]);
    var lindaFolder = randomIndex(chosenFolder.length);
    console.log("-------------------------");
    console.log("sent out a(n) " + lindaList[randomFolder]);
    console.log(chosenFolder[lindaFolder]);
    msg.channel.send(lindaList[randomFolder] + "!", {
      files: [
        imagePath + lindaList[randomFolder] + "/" + chosenFolder[lindaFolder]
      ]
    })
  };

  if (command === 'lindas') {
    var lindaList = fs.readdirSync(imagePath);
    var index = lindaList.indexOf("desktop.ini");
    lindaList.splice(index, 1);
    var lindaArray = listSort(lindaList);
    for (var i = 0; i < lindaArray.length; i++) {
      msg.author.send("```" + lindaArray[i] + "```");
    }
  };

//////////////////////////////////////////////////////////////////////////////////
//wlt stuff///////////////////////////////////////////////////////////////////////

  if (command === 'wlt') {
    if (args.length === 0) {
      msg.reply(wlt[randomIndex(wlt.length)]);
    }
    else if (args[0] <= 0 || args[0] > wlt.length) {
      msg.reply("Please enter a valid WLT.");
    } else {
      msg.reply(wlt[args - 1]);
    }
  };

//////////////////////////////////////////////////////////////////////////////////
//help stuff//////////////////////////////////////////////////////////////////////

  if (command === 'help') {
    msg.author.send(help);
  };

//////////////////////////////////////////////////////////////////////////////////
//for fun/////////////////////////////////////////////////////////////////////////

  if (command === 'darien') {
    if (msg.member.voiceChannel) {
      msg.member.voiceChannel.join().then(connection => {
        connection.playFile( // if song breaks add in var playaudio =
          "/home/pi/Downloads/Darien_Throat_Clear.wav"
        );
        setTimeout(function() {
          msg.member.voiceChannel.leave();
        }, 5000);
      });
    } else {
      msg.channel.send("Not in a channel mate.");
    }
  };

//////////////////////////////////////////////////////////////////////////////////
// music stuff ///////////////////////////////////////////////////////////////////
// this needs a lot of work lmfao ////////////////////////////////////////////////
  if (command === 'radio') {
    var songList = fs.readdirSync(songPath);
    var index = songList.indexOf("desktop.ini");
    songList.splice(index, 1);
    var randomFolder = randomIndex(songList.length);
    var chosenFolder = fs.readdirSync(songPath + songList[randomFolder]);
    var songFolder = randomIndex(chosenFolder.length);
    console.log("-------------------------");
    console.log("playing from album " + songList[randomFolder]);
    console.log(chosenFolder[songFolder]);
    if (msg.member.voiceChannel) {
      msg.member.voiceChannel.join().then(connection => {
        connection.playFile(  // if song breaks add in var playaudio = 
          songPath + songList[randomFolder] + "/" + chosenFolder[songFolder]
        );
        msg.channel.send(
          "Now playing: " +
            songList[randomFolder] +
            " - " +
            chosenFolder[songFolder]
        );
      });
    } else {
      msg.channel.send("Not in a channel mate.");
    }
  };

  function play(connection, message) {
    var server = queued[msg.guild.id];
    server.dispatcher = connection.playStream(ytdl(queued.queue[0], {filter: "audioonly"}));
    server.queue.shift();
    server.dispatcher.on("end", function(){
      if (server.queue[0]){
        play(connection, message);
      } else {
        connection.disconnect();
      }
    })
  }

  if (command === 'play') {
    link = args[0]
    if (!link || !['www.youtube.com/'].includes(link)) return msg.reply("You need to give a youtube link to play.")
    if (!msg.member.voiceChannel) return msg.reply("You must be in a voice channel.")
    if (!queued[msg.guild.id]) queued[msg.guild.id] = {
      queue: []
    }
    var server = queued[msg.guild.id];
    server.queue.push(args[0]);
    if(!msg.guild.voiceChannel) msg.member.voiceChannel.join().then(function(connection){
      play(connection, msg);
    })
  }

  if (command === 'skip') {
    var server = queued[msg.guild.id];
    if (server.dispatcher) server.dispatcher.end();
    msg.channel.send("Skipped.")
  }

  if (command === 'stop') {
    var server = queued[msg.guild.id];
    if (msg.guild.voiceChannel) {
      for (var i = server.queue.length -1; i >=0, i--;) {
        server.queue.splice(i, 1);
      }
      server.dispatcher.end();
      console.log("-----------------")
      console.log("stopped the queue")
    }
    if (msg.guild.connection) msg.guild.voiceChannel.disconnect();
  }

//////////////////////////////////////////////////////////////////////////////////
// gambling stuff ////////////////////////////////////////////////////////////////

  if (command === 'craps') {

    var amount = args[0]; //Coins to gamble

    if (!amount) return msg.reply('Specify the amount of AP you want to gamble.');

    var output = AP[msg.author.id].AP;
    if (output < amount) return msg.reply("You don't have enough AP to gamble.")
      // 7 or 11 win instantly
      // 2 3 12 lose instantly
      // point get for other rolls eg 5
      // if u roll 5 again, you win
      // if u roll 7 then you lose
    var die = [1, 2, 3, 4, 5, 6]
    var roll1 = die[Math.floor(Math.random() * die.length)];
    var roll2 = die[Math.floor(Math.random() * die.length)];
    var roll = roll1 + roll2
    var winnings = amount * 2;
    msg.reply("You threw down " + amount + " AP coin, for a chance to win " + winnings + " AP coin.")
    msg.channel.send("You rolled " + roll + " 🎲🎲");
    if (roll === 7 || roll === 11) {
      msg.channel.send("Bill it up, you gained " + winnings + " AP coin. 💰");
      AP[msg.author.id].AP += winnings;
    } else if (roll === 2 || roll === 3 || roll === 12) {
      msg.channel.send("You man lost " + amount + " AP coin.");
      AP[msg.author.id].AP -= amount;
      // negativeAP(AP[msg.author.id].AP);
      msg.channel.send("You now have " + AP[msg.author.id].AP + " AP coin.");
    } else {
      msg.channel.send("Rolling again.")
      while (roll != 0) {
      // msg.channel.send("Rolling again.").then(msg => {msg.delete(2000)});
      var rolls1 = die[Math.floor(Math.random() * die.length)]
      var rolls2 = die[Math.floor(Math.random() * die.length)]
      var rolls = rolls1 + rolls2
      msg.channel.send("Rolled " + rolls + ".").then(msg => {msg.delete(3000)});
      if (rolls === 7) {
        msg.channel.send("You've rolled a 7 and lost.");
        AP[msg.author.id].AP -= amount;
        // negativeAP(AP[msg.author.id].AP);
        msg.channel.send("You now have " + AP[msg.author.id].AP + " AP coin.");
        break;
      }
      if (rolls === roll) {
        msg.channel.send("You've rolled another " + roll + ". You win. 💰");
        AP[msg.author.id].AP += winnings;
        msg.channel.send("You now have " + AP[msg.author.id].AP + " AP coin.");
        break;
      }
    } 
  }
  };

  if (command === 'ot') { 
    if (dayCooldown.has(msg.author.id)) {
      // msg.delete();
      return msg.reply("You already went OT today, we'll ride out tomorrow...")
    }
  
    dayCooldown.add(msg.author.id);
  
    setTimeout(() => {
      dayCooldown.delete(msg.author.id);
    }, cdDay * 1000)

    var jobs = ['mad ute', 'invest', 'trapper']
    var failChanceForMadUte = 40
    var failChanceForInvestor = 10
    var failChanceForTrapper = 20
    var pay = Math.floor(Math.random() * 500)
    var jobChoice = jobs[Math.floor(Math.random() * jobs.length)]

    if (jobChoice === 'mad ute') {
      msg.reply("You are going OT as a " + jobChoice + ".")
      rollNumber = Math.floor(Math.random() * 100)
      // console.log(rollNumber)
      if (rollNumber > failChanceForMadUte) {
        msg.channel.send("Chinged up bare ops and took that pack, you got " + pay + " AP coin. 💰")
        AP[msg.author.id].AP += pay
        msg.channel.send("You now have " + AP[msg.author.id].AP + " AP coin.")
      } else {
        msg.channel.send("You got bored up 🔪😂😂")
        AP[msg.author.id].AP -= pay
        // negativeAP(AP[msg.author.id].AP);
        msg.channel.send("You lost " + pay + " AP coin.")
      }     
    }
    if (jobChoice === 'invest') {
      msg.reply("You wanted to go OT, but you've decided to " + jobChoice + " instead.")
      rollNumber = Math.floor(Math.random() * 100)
      // console.log(rollNumber)
      if (rollNumber > failChanceForInvestor) {
        msg.channel.send("📈 Bogdanoff has blessed you today, and you got " + pay + " AP coin. 📈")
        AP[msg.author.id].AP += pay
        msg.channel.send("You now have " + AP[msg.author.id].AP + " AP coin.")
      } else {
        msg.channel.send("📉 DOOMPT EET. 📉")
        AP[msg.author.id].AP -= pay
        // negativeAP(AP[msg.author.id].AP);
        msg.channel.send("You lost " + pay + " AP coin.")
      }     
    }
    if (jobChoice === 'trapper') {
      msg.reply("Diligent " + jobChoice + " stepping out. 🚶🚶")
      rollNumber = Math.floor(Math.random() * 100)
      // console.log(rollNumber)
      if (rollNumber > failChanceForTrapper) {
        msg.channel.send("You sold some packs to junkies and got " + pay + " AP coin. 💰")
        AP[msg.author.id].AP += pay
        msg.channel.send("You now have " + AP[msg.author.id].AP + " AP coin.")
      } else {
        msg.channel.send("You man stepped out and got robbed...")
        AP[msg.author.id].AP -= pay
        // negativeAP(AP[msg.author.id].AP);
        msg.channel.send("You lost " + pay + " AP coin.")
      }     
    }
  };

  if (command === 'coinflip') {
 
    var flip = args[0] //Heads or Tails
    var amount = args[1] //Coins to gamble
    var winnings = amount * 2
    // check if input is correct
    if (!flip || !['heads', 'tails'].includes(flip)) return msg.reply('Please specify the flip, either heads or tails!')
    if (!amount) return msg.reply('Specify the amount you want to gamble!')
    if (AP[msg.author.id].AP < amount) return msg.reply("You don't have enough AP to gamble.")
    // setup game
    var tossChoices = ['heads', 'tails']
    var toss = tossChoices[Math.floor(Math.random() * tossChoices.length)]
    msg.reply("You've bet " + amount + " AP coin that it will be " + flip + ". If you win, you will get " + winnings + " AP coin.")
    if (flip === toss) { 
      msg.channel.send("It is " + toss + " you've won! 💰")
      AP[msg.author.id].AP += winnings
      msg.channel.send("You now have " + AP[msg.author.id].AP + " AP coin.")
    } else {
      msg.channel.send("It is " + toss + " you lose!")
      AP[msg.author.id].AP -= amount
      // negativeAP(AP[msg.author.id].AP);
      msg.channel.send("You now have " + AP[msg.author.id].AP + " AP coin.")
    }
  };
  
});

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

//   if (command === 'xpboard') {

//     //If you put a mention behind the command it searches for the mentioned user in database and tells the position.
//     if (msg.mentions.users.first()) {

//       var output = await leveling.Leaderboard({
//         search: msg.mentions.users.first().id
//       })
//       msg.channel.send(`The user ${msg.mentions.users.first().tag} is number ${output.placement} on my leaderboard!`);

//       //Searches for the top 3 and outputs it to the user.
//     } else {

//       leveling.Leaderboard({
//         limit: 10 //Only takes top 3 ( Totally Optional )
//       }).then(async users => { //make sure it is async

//         if (users[0]) var firstplace = await client.fetchUser(users[0].userid) //Searches for the user object in discord for first place
//         if (users[1]) var secondplace = await client.fetchUser(users[1].userid) //Searches for the user object in discord for second place
//         if (users[2]) var thirdplace = await client.fetchUser(users[2].userid) //Searches for the user object in discord for third place
//         if (users[3]) var fourthplace = await client.fetchUser(users[3].userid)
//         if (users[4]) var fifthplace = await client.fetchUser(users[4].userid)
//         if (users[5]) var sixthplace = await client.fetchUser(users[5].userid)
//         if (users[6]) var seventhplace = await client.fetchUser(users[6].userid)
//         if (users[7]) var eightplace = await client.fetchUser(users[7].userid) 
//         if (users[8]) var nineplace = await client.fetchUser(users[8].userid)
//         if (users[9]) var tenthplace = await client.fetchUser(users[9].userid)

//         message.channel.send(`My leaderboard:

//           1 - ${firstplace && firstplace.tag || 'Nobody Yet'} : ${users[0] && users[0].level || 'None'} : ${users[0] && users[0].xp || 'None'}
//           2 - ${secondplace && secondplace.tag || 'Nobody Yet'} : ${users[1] && users[1].level || 'None'} : ${users[0] && users[0].xp || 'None'}
//           3 - ${thirdplace && thirdplace.tag || 'Nobody Yet'} : ${users[2] && users[2].level || 'None'} : ${users[0] && users[0].xp || 'None'}
//           4 - ${fourthplace && fourthplace.tag || 'Nobody Yet'} : ${users[3] && users[3].level || 'None'} : ${users[0] && users[0].xp || 'None'}
//           5 - ${fifthplace && fifthplace.tag || 'Nobody Yet'} : ${users[4] && users[4].level || 'None'} : ${users[0] && users[0].xp || 'None'}
//           6 - ${sixthplace && sixthplace.tag || 'Nobody Yet'} : ${users[5] && users[5].level || 'None'} : ${users[0] && users[0].xp || 'None'}
//           7 - ${seventhplace && seventhplace.tag || 'Nobody Yet'} : ${users[6] && users[6].level || 'None'} : ${users[0] && users[0].xp || 'None'}
//           8 - ${eightplace && eightplace.tag || 'Nobody Yet'} : ${users[7] && users[7].level || 'None'} : ${users[0] && users[0].xp || 'None'}
//           9 - ${nineplace && nineplace.tag || 'Nobody Yet'} : ${users[8] && users[8].level || 'None'} : ${users[0] && users[0].xp || 'None'}
//           10 - ${tenthplace && tenthplace.tag || 'Nobody Yet'} : ${users[9] && users[9].level || 'None'} : ${users[0] && users[0].xp || 'None'}`)

//       })

//     }
//   }

//   if (command === 'investors') {
 
//     //If you use discord-economy guild based you can use the filter() function to only allow the database within your guild
//     //(message.author.id + message.guild.id) can be your way to store guild based id's
//     //filter: x => x.userid.endsWith(message.guild.id)
 
//     //If you put a mention behind the command it searches for the mentioned user in database and tells the position.
//     if (message.mentions.users.first()) {
 
//       var output = await eco.Leaderboard({
//         filter: x => x.balance > 50,
//         search: message.mentions.users.first().id
//       })
//       message.channel.send(`The user ${message.mentions.users.first().tag} is number ${output} on my leaderboard!`);
 
//     } else {
 
//       eco.Leaderboard({
//         limit: 3, //Only takes top 3 ( Totally Optional )
//         filter: x => x.balance > 50 //Only allows people with more than 100 balance ( Totally Optional )
//       }).then(async users => { //make sure it is async
 
//         if (users[0]) var firstplace = await client.fetchUser(users[0].userid) //Searches for the user object in discord for first place
//         if (users[1]) var secondplace = await client.fetchUser(users[1].userid) //Searches for the user object in discord for second place
//         if (users[2]) var thirdplace = await client.fetchUser(users[2].userid) //Searches for the user object in discord for third place
 
//         message.channel.send(`My leaderboard:
 
// 1 - ${firstplace && firstplace.tag || 'Nobody Yet'} : ${users[0] && users[0].balance || 'None'}
// 2 - ${secondplace && secondplace.tag || 'Nobody Yet'} : ${users[1] && users[1].balance || 'None'}
// 3 - ${thirdplace && thirdplace.tag || 'Nobody Yet'} : ${users[2] && users[2].balance || 'None'}`)
 
//       })
 
//     }
//   }
 
//   if (command === 'transfer') {
 
//     var user = message.mentions.users.first()
//     var amount = args[1]
 
//     if (!user) return message.reply('Reply the user you want to send money to!')
//     if (!amount) return message.reply('Specify the amount you want to pay!')
 
//     var output = await eco.FetchBalance(message.author.id)
//     if (output.balance < amount) return message.reply('You have fewer coins than the amount you want to transfer!')
 
//     var transfer = await eco.Transfer(message.author.id, user.id, amount)
//     message.reply(`AP coins successfully transfered!\nBalance from ${message.author.tag}: ${transfer.FromUser}\nBalance from ${user.tag}: ${transfer.ToUser}`);
//   }
 
//   }
 
//   if (command === 'slots') {
 
//     var amount = args[0] //Coins to gamble
 
//     if (!amount) return message.reply('Specify the amount you want to gamble!')
 
//     var output = await eco.FetchBalance(message.author.id)
//     if (output.balance < amount) return message.reply('You have fewer coins than the amount you want to gamble!')
 
//     var gamble = await eco.Slots(message.author.id, amount, {
//       width: 3,
//       height: 1
//     }).catch(console.error)
//     message.channel.send(gamble.grid)//Grid checks for a 100% match vertical or horizontal.
//     message.reply(`You ${gamble.output}! New balance: ${gamble.newbalance}`)
//   }

// })

bot.login(token);

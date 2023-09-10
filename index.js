const {
  IP,
  login,
  token,
  chat_channel,
  webhook,
  admins,
  players,
  blacklisted,
  prefix,
} = require("./config.json");
const fs = require('fs');
const mineflayer = require("mineflayer");
const movement = require("mineflayer-movement");
const autoeat = require('mineflayer-auto-eat').plugin
const discord = require("discord.js");
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.MessageContent,
  ],
});


let WEBHOOK = new discord.WebhookClient(webhook);
let bot;
let enableBlacklist = false;
let {
  whitelist,
} = config;


client.on("ready", async () => {
  console.log("Bot is ready");
  bot = mineflayer.createBot({
    host: IP,
    username: login.email,
    auth: "microsoft",
    password: login.password,
  });
  let channel = await client.channels.fetch(chat_channel);
  if (bot) {
    setup(bot);
  } else {
    channel.send("Bot is not ready");
    client.destroy();
  }
});

client.on("messageCreate", async (message) => {
  const regex = /(\r\n|\n|\r)/gmiu
  message.content = message.content.replace(regex, ' ')
  message.content = message.content.replace(/[\u{0080}-\u{FFFF}]/gu, " ");
  message.content = message.content.replace(/[^\x20-\x7E\n]/gmiu, " ")
  message.content = message.content.replace(/[^$]\n/gmiu, " ")
  message.content = message.content.substring(0, 100)
  message.content = message.content.replace(/(.{255})..+/, "$1")
  if(message.content.includes('{') || message.content.includes('}') || message.content.includes('$')) {
    message.content = message.content.replace('{', "8=========D")
    message.content = message.content.replace('}', "8=========D")
    message.content = message.content.replace('$', "8=========D")
    }
  if (message.channel.id !== chat_channel) return;
  if (message.author.bot) return;
  else if (
    admins.includes(message.author.id) &&
    message.content.startsWith("!")
  ) {
    let msg = message.content.slice(1);
    bot.chat(`${msg}`);
  } 
  else if(admins.includes(message.author.id) &&
    message.content.startsWith("??")) {
      bot.setControlState("forward", true);
      bot.setControlState("sprint", true);
      bot.setControlState("jump", true);
      setTimeout(() => {
        bot.setControlState("forward", false);
        bot.setControlState("sprint", false);
        bot.setControlState("jump", false);
      }, 10000);
}
  else if(admins.includes(message.author.id) &&
  message.content.startsWith("@@") && whitelist) {
    whitelist = false;
    config.whitelist = whitelist;
fs.writeFileSync('./config.json', JSON.stringify(config, null, 2), 'utf8');
  }
  else if(admins.includes(message.author.id) &&
  message.content.startsWith("@@") && whitelist == false) {
    whitelist = true;
    config.whitelist = whitelist;
fs.writeFileSync('./config.json', JSON.stringify(config, null, 2), 'utf8');

     }
  else if(admins.includes(message.author.id) &&
  message.content.startsWith("aspect") && enableBlacklist == false) {
       enableBlacklist = true;
        }
  else if(admins.includes(message.author.id) &&
  message.content.startsWith("aspect") && enableBlacklist == true) {
    enableBlacklist = false;
           }
  else if(blacklisted.includes(message.author.id) && enableBlacklist) {

  }
  else {
    bot.chat(`[${message.author.username}]: ${message.content}`);
  }
});

client.login(token);

commands = {
  help: (message, username) => {
    bot.chat(`[${username}]: !help - Shows this message`);
  },

};
function sleeps(time) {
  return new Promise(resolve => {
      setTimeout(resolve, time);
  });
}

async function setup(bot) {
  bot.loadPlugin(movement.plugin);
  bot.once("login", function init() {
    const { Default } = bot.movement.goals;
    bot.movement.setGoal(Default);
    bot.setControlState("forward", true);
    bot.setControlState("sprint", true);
    bot.setControlState("jump", true);
    setTimeout(() => {
      bot.setControlState("forward", false);
      bot.setControlState("sprint", false);
      bot.setControlState("jump", false);
    }, 10000);
  });
  bot.once("spawn", () => {
    console.log("Minecraft Bot is ready");
    bot.on("physicsTick", function tick() {
      const entity = bot.nearestEntity((entity) => entity.type === "player");
      if (entity) {
        // Convert the entity username to lowercase for case-insensitive comparison
        const lowercaseEntityUsername = entity.username.toLowerCase();
  
        // Convert the names in the players array to lowercase for comparison
        const lowercasedPlayers = players.map(player => player.toLowerCase());
  
        if (lowercasedPlayers.includes(lowercaseEntityUsername)) {
          bot.movement.heuristic.get("proximity").target(entity.position);
          const yaw = bot.movement.getYaw(240, 15, 1);
          bot.movement.steer(yaw);
        }
      }
    });
  });
  bot.on("message", (message) => {
    console.log(message.toAnsi());
    message = filter(message);
    if (message.includes("Type /tpy")) {
      const rawPlayerName = message
        .split("accept")[0]
        .split("/tpy")[1]
        .trim()
        .split("to")[0]
        .trim();
        // Convert the rawPlayerName to lowercase for case-insensitive comparison
    const playerName = rawPlayerName.toLowerCase();

    // Convert the names in the players array to lowercase for comparison
    const lowercasedPlayers = players.map(player => player.toLowerCase());
      if (lowercasedPlayers.includes(playerName) && whitelist) {bot.chat(`/tpy ${playerName}`);
      WEBHOOK.send({
        username: 'TpLogs',
        content: `${playerName} just tp'ed to me, is this mf sus?`,
      });
    }
      else {
        bot.chat(`/tpn ${playerName}`);
        WEBHOOK.send({
          username: 'TpLogs',
          content: `${playerName} just TRIED tp'ing to me, retard smh`,
        });

    }
    }
  });
  bot.on("chat", async (username, message) => {
    message = filter(message);
    if (message.startsWith(prefix) && players.includes(username)) {
      try {
        commands[message.slice(prefix.length).split(" ")[0]](message, username);
      } catch {}
    }
    await WEBHOOK.send({
      username: username,
      avatarURL: `https://minotar.net/avatar/${username}`,
      content: message,
      flags: [ 4096 ],
    });
  });
  bot.loadPlugin(autoeat)

bot.on('autoeat_started', (item, offhand) => {
    console.log(`Eating ${item.name} in ${offhand ? 'offhand' : 'hand'}`)
    WEBHOOK.send({
      username: 'ImperialsBot',
      content: `Eating @almostmee`,
      flags: [ 4096 ],
    });
})

bot.on('autoeat_finished', (item, offhand) => {
    console.log(`Finished eating ${item.name} in ${offhand ? 'offhand' : 'hand'}`)
})

bot.on('autoeat_error', console.error)
  
bot.on("end", (reason) => {
  console.log(reason);
  WEBHOOK.send({
    username: 'KickErrorMessage',
    content: (reason),
  });
  process.exit(0) 

});

function filter(message) {
  message = message.toString();
  message = message.replaceAll("@", "[No]");
  message = message.replaceAll("~", "\\~");
  message = message.replaceAll("*", "\\*");
  message = message.replaceAll(
    "/((?:https?://)?(?:www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*))/g",
    "<$1>"
  );
  message = message.trim();
  return message;
}}

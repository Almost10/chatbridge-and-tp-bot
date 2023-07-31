const {
  IP,
  login,
  token,
  chat_channel,
  webhook,
  admins,
  players,
} = require("./config.json");
const mineflayer = require("mineflayer");
const movement = require("mineflayer-movement");
const discord = require("discord.js");
const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.MessageContent,
  ],
});
let bot;
client.on("ready", async () => {
  console.log("Bot is ready");
  bot = mineflayer.createBot({
    host: IP,
    username: login.email,
    auth: "microsoft",
    password: login.password,
  });
  let channel = await client.channels.fetch(chat_channel);
  let WEBHOOK = new discord.WebhookClient(webhook);
  if (bot) {
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
        if (entity && players.includes(entity.username)) {
          bot.movement.heuristic.get("proximity").target(entity.position);
          const yaw = bot.movement.getYaw(240, 15, 1);
          bot.movement.steer(yaw);
        }
      });
    });
    bot.on("message", (message) => {
      console.log(message.toAnsi());
      message = message.toString();
      if (message.includes("Type /tpy")) {
        const playerName = message
          .split("accept")[0]
          .split("/tpy")[1]
          .trim()
          .split("to")[0]
          .trim();
        if (players.includes(playerName)) bot.chat(`/tpy ${playerName}`);
      }
    });
    bot.on("chat", async (username, message) => {
      await WEBHOOK.send({
        username: username,
        avatarURL: `https://minotar.net/avatar/${username}`,
        content: message,
      });
    });
  } else {
    channel.send("Bot is not ready");
    client.destroy();
  }
});

client.on("messageCreate", async (message) => {
  if (message.channel.id !== chat_channel) return;
  if (message.author.bot) return;
  else if (
    admins.includes(message.author.id) &&
    message.content.startsWith("!")
  ) {
    let msg = message.content.slice(1);
    bot.chat(`${msg}`);
  } else {
    bot.chat(`[${message.author.username}]: ${message.content}`);
  }
});

client.login(token);

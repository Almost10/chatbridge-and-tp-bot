Minecraft Chatbridge and Whitelist TP Bot

Introduction
This repository contains the code for a Minecraft chat bridge and whitelist teleportation bot. The bot acts as a bridge between Minecraft chat and Discord, allowing players to interact with each other across platforms. Additionally, it offers whitelist management and teleportation functionality for authorized users.

Prerequisites

Before running the bot, make sure you have the following prerequisites installed on your system:


`Node.js: Ensure that you have Node.js installed.`


Command Usage
To use the bot, you can use the following commands:


?? - Make the bot randomly move for 10 seconds (bypass anti-bot).
@@ - Turn tpa whitelist off and on (in that instance only).
aspect - Prevent blacklisted players from talking (in that instance only).


Installation
To install the required Node.js packages, use the following commands in your terminal:

Install mineflayer:

```npm install mineflayer```

Install discord.js:

```npm install discord.js```

Install mineflayer-movement:

```npm install mineflayer-movement```

Install mineflayer-auto-eat:

```npm install mineflayer-auto-eat```

Configuration
Before using the bot, make sure to fill in the necessary details in the config.json file. Include your Minecraft account details, server IP, Discord token, Discord webhook ID, and the list of whitelisted players. For admin functionality, add your Discord ID to the admin section in config.json.

How to Use
To launch the bot, use the following command:

```node index.js```

The bot will now be connected to your Minecraft server and Discord channel. All messages from normal players on Discord will be displayed as "[Name] Player" on Minecraft. To use an admin command, simply type !hello or any other admin command, and the bot will execute it directly without showing the player's name.

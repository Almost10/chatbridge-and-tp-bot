Minecraft Chatbridge and Whitelist TP Bot

Introduction

This repository contains the code for a Minecraft chat bridge and whitelist teleportation bot. The bot acts as a bridge between Minecraft chat and Discord, allowing players to interact with each other across platforms. Additionally, it offers whitelist management and teleportation functionality for authorized users.
Prerequisites

Before running the bot, ensure you have the following prerequisites installed:

Node.js: Make sure you have Node.js installed on your system.

Installation

Use the following commands in your terminal to install the required Node.js packages:

Install mineflayer:
    

``` npm install mineflayer```

 Install discord.js:
    

``` npm install discord.js```

Install mineflayer-movement:

``` npm install mineflayer-movement ```

Configuration

Fill in the necessary details in the config.json file, including your Minecraft account details, server IP, Discord token, Discord webhook ID, and the list of whitelisted players.
For admin functionality, add your Discord ID to the admin section in config.json.

How to Use

Launch the bot using the command:

```bash

node index.js
```
 The bot will now be connected to your Minecraft server and Discord channel.
 All normal players' messages from Discord will be displayed as "[Name] Player" on MineCraft.
 To use an admin command, simply type !hello or any other admin command, and the bot will execute it directly without showing the player's name.

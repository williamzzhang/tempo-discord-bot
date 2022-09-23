const Discord = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const fs = require("fs")
const {Player} = require("discord-player")
const { Client, GatewayIntentBits } = require('discord.js');

dotenv.config()
const TOKEN = process.env.TOKEN

// Loads in slash commands
const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = "1022680386666500146"
const GUILD_ID = "1022684167785418854"

const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
})

client.slashcommands = new Discord.Collection()
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

let commands = []

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))
for (const file of commandFiles) {
    const slashcmd = require(`./commands/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

// Loading in slash commands to the bot
if (LOAD_SLASH) {
    const rest = new REST({ version: "9"}).setToken(TOKEN)
    console.log("Deploying bot commands")
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body:commands})
    .then(() => {
        console.log("Successfully loaded commands")
        process.exit(0)
    })
    .catch((err) => {
        if (err) {
            console.log(err)
            process.exit(1)
        }
    })
}
else {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`)
    })
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return

            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) {
                interaction.reply("Not a valid command")
            }

            await interaction.deferReply()
            slashcmd.run({client, interaction})
        }
        handleCommand()
    })
    client.login(TOKEN)
}
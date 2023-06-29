import CustomClient from "./structure/CustomClient"

import { Collection, REST, Routes, WebhookClient, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
const client = new CustomClient()
const fs = require('node:fs');
const path = require('node:path');
const webhook = new WebhookClient({ url: "https://discord.com/api/webhooks/1123920158184972288/zN9787zUiu7QmqjeShd86J9hPkh9YVGvO1UvLZPJk1fA1h1SNur3p1pM7hk8lvPhRJEv" })

client.commands = new Collection()
const commands: any[] = []
const token = "ODIyODMxNzQ5NzA4OTA2NTU2.GlNzHb.u5y3MNJ62QAKF0qNEn2NNrzIuFKuC2UxOeeoHg"
const ytdl = require('ytdl-core');
interface command {
    data: SlashCommandBuilder,
    execute: Function
}


const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

for (const file of commandFiles) {
    const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath) as command;
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.logError = function (error = "Unknown error") {
    console.error(`[ERROR] ${error}`)
    const embed = new EmbedBuilder()
        .setColor('#ED4245')
        .setFooter({ text: (client.user?.username as string), iconURL: client.user?.avatarURL({ size: 1024 }) as string })
        .setTitle(`${client.user?.username} Error logs`)
        .setTimestamp()
        .setDescription(`[ERROR] ${error}`)
    webhook.send({
        username: `${client.user?.username} Error logs`,
        avatarURL: client.user?.avatarURL({ size: 1024 }) as string,
        embeds: [embed]
    })
}
client.logInfo = function (info = "Unknown info") {
    console.info(`[INFO] ${info}`)
    const embed = new EmbedBuilder()
        .setColor("#313338")
        .setFooter({ iconURL: client.user?.avatarURL({ size: 1024 }) as string, text: client.user?.username as string })
        .setTitle(`${client.user?.username} Info logs`)
        .setTimestamp()
        .setDescription(`[INFO] ${info}`)
    webhook.send({
        username: `${client.user?.username} Info logs`,
        avatarURL: client.user?.avatarURL({ size: 1024 }) as string,
        embeds: [embed]
    })
}

client.queue = new Map()
const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands("822831749708906556"),
            { body: commands },
        ) as any;

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();

client.login(token)

const pathToEvents = path.join(__dirname, "events")
const files = fs.readdirSync(pathToEvents)

files.forEach((file: string) => {
    const filePath = path.join(pathToEvents, file);
    const event = require(filePath)
    if (event.once) {
        client.once(event.name, async (...args) => event.execute(...args))
    } else {
        client.on(event.name, async (...args) => event.execute(...args, client))
    }
})


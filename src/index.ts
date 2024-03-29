import CustomClient from "./classes/CustomClient"

import { WebhookClient, EmbedBuilder } from 'discord.js'
import logger from "./logger";
const client = new CustomClient()
import fs from 'node:fs';
import path from 'node:path';

client.config = require("./config.json")
let webhook: WebhookClient | null = null
if (client.config.webhookEnabled) {
    webhook = new WebhookClient({ url: client.config.webhook })
}
const token = client.config.token;

client.config2 = {
    colors: { success: '#57F287', error: '#ED4245', normal: "#313338" }
}

client.logError = function (error: string = "Unknown error", advanced?: { enabled: boolean, id: string }) {
    logger.error(error)
    if (!client.user) return;
    const embed = new EmbedBuilder()
        .setColor(client.config2.colors.error)
        .setFooter({ text: (client.user?.username as string), iconURL: client.user?.avatarURL({ size: 1024 }) as string })
        .setTitle(`${client.user?.username} Error logs`)
        .setTimestamp()
        .setDescription(`${advanced?.enabled ? `Code: **${advanced.id}**` : ""}\`\`\`${error}\`\`\``)
    if (webhook != null) webhook.send({
        username: `${client.user?.username} Error logs`,
        avatarURL: client.user?.avatarURL({ size: 1024 }) as string,
        embeds: [embed]
    })
}
client.logInfo = function (info: string = "Unknown info") {
    logger.info(info)
    if (!client.user) return;
    const embed = new EmbedBuilder()
        .setColor(client.config2.colors.normal)
        .setFooter({ iconURL: client.user?.avatarURL({ size: 1024 }) as string, text: client.user?.username as string })
        .setTitle(`${client.user?.username} Info logs`)
        .setTimestamp()
        .setDescription(`[INFO] ${info}`)
    if (webhook != null) webhook.send({
        username: `${client.user?.username} Info logs`,
        avatarURL: client.user?.avatarURL({ size: 1024 }) as string,
        embeds: [embed]
    })
}

client.login(token)

client.deployCommands(token)
client.deployWebPage()

const pathToEvents = path.join(__dirname, "events")
const files = fs.readdirSync(pathToEvents)

for (let i = 0; i < files.length; i++) {
    const file = files[i] as string;
    const filePath = path.join(pathToEvents, file);
    const event = require(filePath)
    if (event.once) {
        client.once(event.name, async (...args) => event.execute(...args))
    } else {
        client.on(event.name, async (...args) => event.execute(...args, client))
    }
}



import { Client, GatewayIntentBits, Events, Collection, REST, Routes, WebhookClient, EmbedBuilder, GatewayDispatchEvents } from 'discord.js'

export default class Command extends Client {
    commands: Collection<string, Command> = new Collection();
    logInfo: Function = (info: string = "Unknown info") => {};
    logError: Function = (error: string = "Unknown error") => {};
    queue: Map<any, any> = new Map();

    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
        });
    }
}
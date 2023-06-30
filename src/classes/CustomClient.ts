
import { Client, GatewayIntentBits, Events, Collection, REST, Routes, WebhookClient, EmbedBuilder, GatewayDispatchEvents } from 'discord.js'
import Command from './Command';
const fs = require('node:fs');
const path = require('node:path');

export default class CustomClient extends Client {
    commands: any[];
    logInfo: Function = (info: string = "Unknown info") => { };
    logError: Function = (error: string = "Unknown error") => { };
    queue: Map<any, any> = new Map();

    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
        });
    }


    async deployCommands(token: string) {
        const commandsPath = path.join(__dirname, 'commands');
        const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));

        for (const file of commandFiles) {
            const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath) as Command;
                if ('data' in command && 'execute' in command) {
                    this.commands.push(command.data.toJSON());
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }
        const rest = new REST().setToken(token);

        (async () => {
            try {
                console.log(`Started refreshing ${this.commands.length} application (/) commands.`);

                const data = await rest.put(
                    Routes.applicationCommands("822831749708906556"),
                    { body: this.commands },
                ) as any;

                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            } catch (error) {
                console.error(error);
            }
        })();
    }
}
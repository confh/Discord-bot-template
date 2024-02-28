
import { Client, ColorResolvable, GatewayIntentBits, REST, Routes } from 'discord.js'
const express = require("express")
import Command from './Command';
import fs from 'node:fs';
import path from 'node:path';
const app = express()

export default class CustomClient extends Client {
    rest_commands: any[] = [];
    commands: Command[] = [];
    logInfo = (info: string = "Unknown info") => { };
    logError = (error: string = "Unknown error", advanced?: { enabled: boolean, id: string }) => { };
    config: {
        owners: string[],
        token: string,
        clientid: string,
        webhook: string,
        webhookEnabled: boolean
    };
    config2: {
        colors: {
            success: ColorResolvable,
            error: ColorResolvable,
            normal: ColorResolvable
        }
    }

    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages]
        });
    }

    /**
     * Register commands
     * @param token - Secret token of the bot 
     */
    async deployCommands(token: string) {
        const commandsPath = path.join(__dirname.split("\\").slice(0, __dirname.split("\\").length - 1).join("\\"), 'commands');
        const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath) as Command;
            if ('data' in command && 'execute' in command) {
                this.rest_commands.push(command.data.toJSON());
                this.commands.push(command)
            } else {
                this.logInfo(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
        const rest = new REST().setToken(token);
        try {
            this.logInfo(`Started refreshing ${this.rest_commands.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationCommands(this.config.clientid),
                { body: this.rest_commands },
            ) as any;

            this.logInfo(`Successfully reloaded ${data.length} application (/) commands.`.toString());
        } catch (error) {
            this.logError(error as string);
        }
    }

    /**
     * Deploys webservice so if you want to ping it every 5 minutes to make the bot online 24/7
     */
    async deployWebPage() {
        app.get("/", (req: any, res: any) => {
            res.send(`${this.user?.username} is online`)
        })
        this.logInfo("Successfully loaded webpage")
        app.listen(process.env.PORT || 3000)
    }
}
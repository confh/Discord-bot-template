import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import CustomClient from "./CustomClient";

export default class Command {
    public data: SlashCommandBuilder;
    public execute: (interaction: CommandInteraction, client: CustomClient) => any;
    public owneronly?: boolean

    constructor(options: Command) {
        Object.assign(this, options)
    }
}
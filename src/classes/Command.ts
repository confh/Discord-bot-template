import { SlashCommandBuilder } from "discord.js";
import CustomClient from "./CustomClient";

export default class Command {
    data: SlashCommandBuilder;
    execute: (interaction: any, client: CustomClient) => any;
}
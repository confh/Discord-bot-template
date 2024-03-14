import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import Command from "../classes/Command"
import functions from "../Utils"

module.exports = new Command({
    data: new SlashCommandBuilder()
        .setName("servers")
        .setDescription("Shows all the servers that the bot is in."),
    owneronly: true,
    async execute(interaction, client) {
        const serversMapped = client.guilds.cache.map((guild, i) => `**${i}.** Name: ${guild.name}\nID: ${guild.id}\nMembers Count: ${guild.members.cache.size}\nReal users: ${guild.members.cache.filter(member => member.user.bot == false).size}\nBots: ${guild.members.cache.filter(member => member.user.bot).size}`)

        let options = {
            title: "My servers",
            header: `${client.guilds.cache.size} servers`,
            joinBy: "\n\n",
            perPage: 5,
            timestamp: true
        }

        functions.embedPages(client, interaction, serversMapped, options)
    }
})